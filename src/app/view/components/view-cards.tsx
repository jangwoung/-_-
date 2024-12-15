"use client";
import React, { useState, useEffect } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../../../lib/firebase/config";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export const Cards = () => {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const prefecture = searchParams.get("prefecture");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        setIsLoading(true);
        const storage = getStorage();

        // Create a query based on the prefecture parameter
        let firestoreQuery;
        if (prefecture) {
          firestoreQuery = query(
            collection(db, "Japan"),
            where("prefecture", "==", prefecture)
          );
        } else {
          firestoreQuery = collection(db, "Japan");
        }

        const querySnapshot = await getDocs(firestoreQuery);

        const cardData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();

            if (data.img && typeof data.img === "string") {
              try {
                const imageRef = ref(storage, data.img);
                const downloadURL = await getDownloadURL(imageRef);
                return {
                  id: doc.id,
                  ...data,
                  img: downloadURL,
                };
              } catch (imgError) {
                console.error(`Error fetching image for ${doc.id}:`, imgError);
                return {
                  id: doc.id,
                  ...data,
                  img: null,
                };
              }
            }

            return {
              id: doc.id,
              ...data,
            };
          })
        );

        setCards(cardData);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to fetch cards");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchCards();
  }, [prefecture]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh w-full justify-center items-center">
        <h1 className="text-6xl text-white font-bold animate-bounce pb-10">
          Loading...
        </h1>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderCardRows = () => {
    const rows = [
      { animate: "animate-flow-right", bg: "bg-green-dark" },
      { animate: "animate-flow-left", bg: "" },
      { animate: "animate-flow-right", bg: "bg-green-dark" },
      { animate: "animate-flow-left", bg: "" },
    ];

    return rows.map((row, index) => {
      // Repeat cards to ensure at least 10 items
      const displayCards =
        cards.length > 0
          ? cards.length < 10
            ? [...Array(Math.ceil(10 / cards.length))].flatMap(() => cards)
            : cards
          : [];

      return (
        <div
          key={index}
          className={`z-0 ${
            index % 2 === 0 ? "mt-0" : "mt-5"
          } relative w-full overflow-hidden ${row.bg} py-8`}
        >
          <div className={`flex ${row.animate} items-center gap-5 px-4`}>
            {displayCards.slice(0, 10).map((card, cardIndex) => (
              <div
                key={`${card.id}-${cardIndex}`}
                className="relative flex-shrink-0"
              >
                {card.img ? (
                  <Image
                    width={200}
                    height={200}
                    alt={card.name || card.id}
                    src={card.img}
                    className="bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md"
                  />
                ) : (
                  <div className="bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md flex items-center justify-center text-white">
                    No Image
                  </div>
                )}
                {/* <div className="absolute bottom-2 right-2 rounded-sm px-4 bg-black">
                  <h1 className="text-white font-bold opacity-100">
                    #{card.name}
                  </h1>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-2">
      {cards.length > 0 ? (
        renderCardRows()
      ) : (
        <div className="text-white text-2xl">
          {prefecture
            ? `No cards found for ${prefecture} prefecture`
            : "No cards available"}
        </div>
      )}
    </div>
  );
};
