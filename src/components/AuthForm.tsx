"use client";
import Link from "next/link";
import React from "react";

interface AuthFormProps {
  children: React.ReactElement;
  title?: string;
  description?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({
  children,
  title,
  description,
}) => {
  return (
    <>
      <div className="md:grid md:grid-cols-12 overflow-hidden md:mt-[-5px] flex flex-col h-[100vh] justify-center ">
        <div className="col-span-6 bg-black hidden md:block">
          <div className="flex flex-col justify-between md:h-[100vh] text-white cursor-pointer">
            <div className="flex items-center px-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-6 w-6"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
              <Link href="/" className="cursor-pointer py-4">
                <p className="text-white py-4 text-xl text-center">
                  Quick Release
                </p>
              </Link>
            </div>
            <p className="text-white py-6 text-xl px-4">
              "Application to save hours of work and make adding changelogs for
              your product easier"
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center md:hidden ">
          <div className="md:hidden bg-black flex items-center justify-center text-white cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <Link href="/" className="cursor-pointer">
              <p className="text-white py-4 text-xl text-center">
                Quick Release
              </p>
            </Link>
          </div>
          <div className="border-2 md:col-span-6 flex flex-col items-center justify-center">
            <p className="text-2xl text-black font-bold pt-2 md:pt-0">
              {title}
            </p>
            <p className="text-sm text-gray-400 font-bold py-2">
              {description}
            </p>
            <div className="md:w-80">{children}</div>
          </div>
        </div>

        <div className="border-2 md:col-span-6 flex flex-col items-center justify-center">
          <p className="text-2xl text-black font-bold pt-2 md:pt-0 hidden md:block">
            {title}
          </p>
          <p className="text-sm text-gray-400 font-bold py-2 hidden md:block">
            {description}
          </p>
          <div className="md:w-80 hidden md:block">{children}</div>
        </div>
      </div>
    </>
  );
};
export default AuthForm;
