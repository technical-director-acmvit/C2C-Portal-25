import React from "react";

const Bento = () => {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="grid h-full w-full gap-4 bg-gray-200 p-2 grid-cols-6 grid-rows-2 rounded-lg shadow-md">
        <div className="col-span-2 row-span-1 bg-pink-200 rounded-full aspect-square h-full shadow-md flex items-center justify-center ml-auto">
          <p>Salmon</p>
        </div>

        <div className="col-span-3 row-span-1 bg-lime-200 rounded-lg shadow-md flex items-center justify-center">
          <p>Broccoli</p>
        </div>

        <div className="col-span-1 row-span-1 bg-yellow-200 rounded-lg shadow-md flex items-center justify-center">
          <p>Tamago</p>
        </div>

        <div className="col-span-2 row-span-1 bg-red-200 rounded-lg shadow-md flex items-center justify-center">
          <p>Pork</p>
        </div>

        <div className="col-span-1 row-span-1 bg-green-200 rounded-lg shadow-md flex items-center justify-center">
          <p>Edamame</p>
        </div>

        <div className="col-span-3 row-span-1 bg-red-200 rounded-lg shadow-md flex items-center justify-center">
          <p>Tomato</p>
        </div>
      </div>
    </div>
  );
};

export default Bento;
