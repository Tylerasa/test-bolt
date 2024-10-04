import Image from "next/image";
import duck from "public/assets/images/psyduck.png";
import React from "react";

const NoDataComponent = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Image alt="image of psyduck" width={200} height={300} src={duck} />
      <p className="mt-4 text-center font-[300] text-white">{text}</p>
    </div>
  );
};

export default NoDataComponent;
