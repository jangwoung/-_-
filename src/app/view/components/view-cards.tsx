import React from "react";

export const Cards = () => {
  return (
    <div className="flex flex-col items-center justify-center pt-2">
      {/* <h1 className="w-full py-2 text-center text-4xl font-extrabold text-beige underline bg-green-dark">
        今日の観光大臣！
      </h1> */}
      <div className="z-0 relative w-full overflow-hidden bg-green-dark py-8">
        <div className="flex animate-flow-right items-center gap-5 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 relative bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md"
            >
              <div className="absolute bottom-2 right-2 rounded-sm px-4 bg-black">
                <h1 className="text-white font-bold opacity-100">
                  #XXXXXX {item}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="z-0 mt-5 relative w-full overflow-hidden">
        <div className="flex animate-flow-left items-center gap-5 pb-4 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 relative bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md"
            >
              <div className="absolute bottom-2 right-2 rounded-sm px-4 bg-black">
                <h1 className="text-white font-bold opacity-100">
                  #XXXXXX {item}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="z-0 relative w-full overflow-hidden bg-green-dark py-8">
        <div className="flex animate-flow-right items-center gap-5 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 relative bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md"
            >
              <div className="absolute bottom-2 right-2 rounded-sm px-4 bg-black">
                <h1 className="text-white font-bold opacity-100">
                  #XXXXXX {item}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="z-0 mt-5 relative w-full overflow-hidden">
        <div className="flex animate-flow-left items-center gap-5 pb-4 px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
            <div
              key={item}
              className="flex-shrink-0 relative bg-gray-400 rounded-2xl aspect-square w-[200px] shadow-md"
            >
              <div className="absolute bottom-2 right-2 rounded-sm px-4 bg-black">
                <h1 className="text-white font-bold opacity-100">
                  #XXXXXX {item}
                </h1>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
