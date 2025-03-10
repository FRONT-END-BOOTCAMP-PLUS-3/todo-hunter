import React from "react";

import Image from "next/image";
import Spinner from "@/public/icons/Loading_spinner.svg"; 

const Loading = () => {
  return(
        <div className="flex flex-col justify-center items-center min-h-screen">
        <Image src={Spinner} alt="로딩" width={100} height={100} />
        </div>
);
};

export default Loading;