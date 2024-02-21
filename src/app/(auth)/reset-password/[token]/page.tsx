"use client";

import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import { toast } from "react-toastify";

const ResetPassword = ({ params }: any) => {
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const formSchema = z
    .object({
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
      confirmPassword: "",
    },
  });

  const resetPassword = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault();
    setLoader(true);

    const data = {
      ...values,
      email: user?.email,
    };

    try {
      await axios.post("/api/reset-password", data);
      toast.success("Reset Successfully");
      setLoader(false);
      router.push("/");
    } catch (error: any) {
      setLoader(false);
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post("/api/verify-token", {
          token: params.token,
        });
        setVerified(true);
        const userData = await res.data;
        setUser(userData);
      } catch (error) {
        setVerified(true);
      }
    };
    verifyToken();
  }, [params.token]);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link
        href="/"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
      >
        <img
          className="w-8 h-8 mr-2"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
          alt="logo"
        />
        Quick Release
      </Link>{" "}
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Set New Password
          </h1>{" "}
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(resetPassword)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                New Password
              </label>{" "}
              <div className="flex items-center focus-within:border-2 focus-within:border-black bg-gray-50 border rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className=" border-gray-300 text-gray-900 sm:text-sm focus:outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                {errors.password && (
                  <span className="text-red-600 text-[12px]">
                    {errors.password.message}
                  </span>
                )}
                <div
                  className="px-4 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>{" "}
            <div>
              <label
                htmlFor="confirm-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Confirm password
              </label>{" "}
              <input
                type="password"
                id="confirm-password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
              {errors.confirmPassword && (
                <span className="text-red-600 text-[12px]">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                "Reset Password"
              )}{" "}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Login to your account{" "}
              <Link
                href="/"
                className="font-extrabold text-primary-600 hover:underline dark:text-primary-500 "
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
