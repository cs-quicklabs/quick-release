"use client";

import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

const page = () => {
  const [activeUser, setActiveUser] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const formSchema = z
    .object({
      oldPassword: z
        .string()
        .min(1, { message: "Required" })
        .min(6, { message: "Password should be minimum 6 characters" }),
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

  const getActiveUser = async () => {
    try {
      const res = await axios.get("/api/get-active-user");
      setActiveUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getActiveUser();
  }, []);

  const updatePassword = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoader(true);
      const res = await axios.post(
        `/api/change-password/${activeUser.id}`,
        values
      );
      toast.success(res.data.message);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data.message);
    }
    setLoader(false);
  };

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsNav />
          <main className="max-w-xl pb-12 px-4 lg:col-span-6">
            <div>
              <h1 className="text-lg font-semibold dark:text-white">
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
                  <input
                    type="password"
                    {...register("oldPassword")}
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    New Password
                  </label>{" "}
                  <input
                    type="password"
                    {...register("password")}
                    id=""
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>{" "}
                <div className="mb-5">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>{" "}
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="••••••••"
                  />
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
                    "Update Password"
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
