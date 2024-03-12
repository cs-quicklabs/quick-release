import React from "react";
import Spin from "./Spin";



const Loading = () => {
  return (
    <div role="status" className="text-center h-full flex items-center justify-center">
      <Spin />

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
