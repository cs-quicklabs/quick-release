import { Navbar } from "../components/Navbar";
import React from "react";

const BaseTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default BaseTemplate;
