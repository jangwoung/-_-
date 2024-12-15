import Konva from "konva";
import { ref, uploadBytes } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { storage } from "../../../../lib/firebase/config";
import axios from "axios";

// Firestoreの初期化
const db = getFirestore();

// Google Maps Geocoding APIキー
const GOOGLE_MAPS_API_KEY = "AIzaSyC6cqvinxnsSj9J0ASt5B6LcmdXXEwMG1s";

// タイムスタンプを YYYYMMDD 形式にする関数
function getFormattedTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

// DataURLをBlobに変換する関数
function dataURLToBlob(dataURL: string): Blob {
  const parts = dataURL.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

// 逆ジオコーディングで市と県を取得する関数
async function getCityAndPrefecture(lat: number, lng: number) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const results = response.data.results;
    let city = "";
    let prefecture = "";

    if (results.length > 0) {
      const addressComponents = results[0].address_components;

      for (const component of addressComponents) {
        if (component.types.includes("administrative_area_level_1")) {
          prefecture = component.long_name; // 都道府県
        }
        if (component.types.includes("locality")) {
          city = component.long_name; // 市区町村
        }
      }
    }
    return { city, prefecture };
  } catch (error) {
    console.error("逆ジオコーディングに失敗しました:", error);
    throw error;
  }
}

// Canvasを画像に変換しFirebase StorageとFirestoreに保存する関数
export const exportToImage = async (
  stageRef: React.RefObject<Konva.Stage>,
  uid: string
) => {
  if (stageRef.current) {
    const dataUrl = stageRef.current.toDataURL(); // CanvasからデータURLを取得

    try {
      // データURLをBlobに変換
      const imageBlob = dataURLToBlob(dataUrl);

      // タイムスタンプとファイル名
      const timestamp = getFormattedTimestamp();
      const fileName = `exported_image_${timestamp}.png`;

      // Firebase Storageの参照パス
      const storagePath = `japan/${fileName}`;
      const storageRef = ref(storage, storagePath);

      // Firebase Storageに画像をアップロード
      await uploadBytes(storageRef, imageBlob);
      console.log("画像がFirebase Storageにアップロードされました:", fileName);

      // 現在位置を取得
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 市と県の情報を取得
          const { city, prefecture } = await getCityAndPrefecture(
            latitude,
            longitude
          );

          // Firebase StorageのURLを生成
          const imgURL = `gs://gakusai-ankylo.firebasestorage.app/${storagePath}`;

          // Firestoreにデータを保存
          const data = {
            img: imgURL,
            name: "桜島",
            city: city || "kitakyushu",
            prefecture: prefecture || "fukuoka",
            timestamp: new Date(),
          };

          const docRef = await addDoc(collection(db, "Japan"), data);
          console.log("データがFirestoreに保存されました:", docRef.id);

          // セッションストレージに保存
          sessionStorage.setItem("imageURL", imgURL);
          console.log("URLがセッションストレージに保存されました:", imgURL);
        },
        (error) => {
          console.error("位置情報の取得に失敗しました:", error);
        }
      );
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  }
};
