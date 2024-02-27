import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";
import Link from "next/link";
import React from "react";
import { z } from "zod";

const page = () => {
  const formSchema = z
    .object({
      firstName: z.string().min(1, { message: "Required" }).max(50, {
        message: "Fisrt Name can be maximum 50 characters",
      }),
      lastName: z.string().min(1, { message: "Required" }).max(50, {
        message: "Last Name can be maximum 50 characters",
      }),
      email: z
        .string()
        .min(1, { message: "Required" })
        .email({ message: "Invalid email address" }),
      orgName: z.string().min(1, { message: "Required" }),
      password: z
        .string()
        .min(1, { message: "Required" })
        .min(6, { message: "Password should be minimum 6 characters" }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });
  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsNav />
          <main className="max-w-xl pb-12 px-4 lg:col-span-6">
            <div>
              <h1 className="text-lg font-semibold dark:text-white">
                Profile Settings
              </h1>{" "}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Change your personal profile settings
              </p>{" "}
              <form className="w-full mt-6">
                <div className="sm:col-span-2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload avatar
                  </label>{" "}
                  <div className="items-center w-full sm:flex">
                    <img
                      className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0"
                      src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png"
                      alt="Helene avatar"
                    />
                  </div>
                </div>{" "}
                <div className="mb-5 mt-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>{" "}
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Aashish"
                  />
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>{" "}
                  <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Dhawan"
                  />
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>{" "}
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="aashish@gmail.com"
                  />
                </div>{" "}
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Save
                </button>
              </form>
            </div>
          </main>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default page;
