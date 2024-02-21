"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import { toast } from "react-toastify";
const ForgotPassword = () => {
  const [loader, setLoader] = useState(false);
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgetPassword = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post("/api/forget-password", values);
      toast.success("Reset Link Sent Successfully");
      setLoader(false);
    } catch (e: any) {
      toast.error(e.response.data);

      setLoader(false);
    }
  };
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
            Forgot your password?
          </h1>{" "}
          <form
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(forgetPassword)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>{" "}
              <input
                type="email"
                {...register("email")}
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@company.com"
              />
              {errors.email && (
                <span className="text-red-600 text-[12px]">
                  {errors.email.message}
                </span>
              )}
            </div>{" "}
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
                "Request Password"
              )}{" "}
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Login to your account{" "}
              <Link
                href="/"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
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

export default ForgotPassword;
