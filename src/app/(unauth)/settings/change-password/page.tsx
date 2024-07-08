"use client";

import { requestHandler, showNotification } from "@/Utils";
import { changePasswordRequest } from "@/fetchHandlers/authentication";
import { useUserContext } from "@/app/context/UserContext";
import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";
import { User } from "@/interfaces";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

const page = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const { loggedInUser } = useUserContext();

  const [loader, setLoader] = useState(false);
  const formSchema = z
    .object({
      oldPassword: z.string().trim().min(1, { message: "Required" }),
      password: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .min(8, { message: "Password should be minimum 8 characters" }),
      confirmPassword: z.string().trim().min(1, { message: "Required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      oldPassword: "",
      confirmPassword: "",
    },
  });

  const updatePassword = async (values: z.infer<typeof formSchema>) => {
    await requestHandler(
      async () =>
        await changePasswordRequest(values, loggedInUser?.id as string),
      setLoader,
      (res: any) => {
        const { message } = res;
        showNotification("success", message);
      },
      (err: any) => {
        showNotification("error", err);
      }
    );
  };

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsNav />

          <main className="max-w-xl pb-12 px-4 lg:col-span-6">
            <div>
              <h1 className="text-lg font-semibold dark:text-white" id="Change-Password">
                Change Password
              </h1>{" "}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Please change your password.
              </p>{" "}
              <form
                className="w-full mt-6"
                onSubmit={handleSubmit(updatePassword)}
              >
                <div className="mb-5 mt-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Old Password
                  </label>{" "}
                  <div className="flex items-center focus-within:border-2 focus-within:border-blue-600 bg-gray-50 border border-gray-300 rounded-lg">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      {...register("oldPassword")}
                      id=""
                      className=" p-[0.70rem] bg-gray-50  border-gray-300 text-gray-900 sm:text-sm rounded-lg border-none focus-within:border-none focus-within:ring-0 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="••••••••"
                    />
                    <div
                      className="px-4 cursor-pointer"
                      onClick={() =>
                        setShowOldPassword(!showOldPassword)
                      }
                    >
                      {showOldPassword ? (
                        <EyeIcon className="w-6 h-6" />
                      ) : (
                        <EyeSlashIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {errors.oldPassword && (
                    <span className="text-red-600 text-[12px]">
                      {errors.oldPassword.message}
                    </span>
                  )}
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>{" "}
                  <div className="flex items-center focus-within:border-2 focus-within:border-blue-600 bg-gray-50 border border-gray-300 rounded-lg">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      id=""
                      className=" p-[0.70rem] bg-gray-50  border-gray-300 text-gray-900 sm:text-sm rounded-lg border-none focus-within:border-none focus-within:ring-0 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="••••••••"
                    />
                    <div
                      className="px-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeIcon className="w-6 h-6" />
                      ) : (
                        <EyeSlashIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <span className="text-red-600 text-[12px]">
                      {errors.password.message}
                    </span>
                  )}
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="••••••••"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>{" "}
                  <div className="flex items-center focus-within:border-2 focus-within:border-blue-600 bg-gray-50 border border-gray-300 rounded-lg">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      id=""
                      className=" p-[0.70rem] bg-gray-50  border-gray-300 text-gray-900 sm:text-sm rounded-lg border-none focus-within:border-none focus-within:ring-0 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="••••••••"
                    />
                    <div
                      className="px-4 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="w-6 h-6" />
                      ) : (
                        <EyeSlashIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-red-600 text-[12px]">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>{" "}
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loader ? (
                    <div className="flex items-center justify-center gap-4">
                      <Oval
                        height={25}
                        width={25}
                        color="black"
                        secondaryColor="white"
                      />
                    </div>
                  ) : (
                    "Save"
                  )}{" "}
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
