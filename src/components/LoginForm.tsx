"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";
import { requestHandler, showNotification } from "@/Utils";
import { resendVerificationLinkRequest, verifyRegisterTokenRequest } from "@/fetchHandlers/authentication";
import AlertModal from "./AlertModal";
import Image from "next/image";
import { WEB_DETAILS } from "@/Utils/constants";

export default function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const token = useMemo(() => search.get("token"), [search]);

  const [loader, setLoader] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    password: z.string().trim().min(1, { message: "Required" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginUser(values: z.infer<typeof formSchema>, e: any) {
    toast.dismiss();
    try {
      setLoader(true);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (!res?.error) {
        router.push("/allLogs");
      }
      if (res?.error === "Incorrect Credentials!") {
        toast.error(res.error as string);
      }
      if (res?.error === "Your Account is not Verified Yet, Check Email") {
        setUserEmail(values.email);
        setIsOpen(true);
      }
    } catch (error) {
      if (error) {
        toast.error(error ? "Invalid Credentials" : "");
      }
    } finally {
      setLoader(false);
    }
  }
  useEffect(() => {
      if (token) {
        const verifyToken = async () => {
          await requestHandler(
            async () => await verifyRegisterTokenRequest({token}),
            setLoader,
            (res: any) => {
              const { message } = res;
              showNotification("success", message);
            },
            (errMessage) => {
              showNotification("error", errMessage);
            }
          );
      }
      verifyToken();
    }
  }, []);

  const resendEmail = async () => {
    await requestHandler(
      async () => await resendVerificationLinkRequest({ email: userEmail }),
      setResendLoading,
      (res: any) => {
        const { message } = res;
        showNotification("success", message);
        router.push("/");
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src={WEB_DETAILS.favicon}
            alt="logo"
            width={32}
            height={32}
          />
          Quick Release
        </Link>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>{" "}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(loginUser)}
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
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-600 text-[12px]">
                    {errors.email.message}
                  </span>
                )}
                {isOpen && (
                  <AlertModal
                    show={isOpen}
                    title="Account Not Confirmed"
                    message="Check your email if already registered"
                    okBtnText="Resend Verification Link"
                    cancelBtnText="Cancel"
                    loading={resendLoading}
                    onClickOk={ async () => {
                      await resendEmail(),
                      setIsOpen(false)
                    }}
                    onClickCancel={() => setIsOpen(false)}
                  />
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>{" "}
                <div className="flex items-center focus-within:border-2 focus-within:border-blue-600 bg-gray-50 border border-gray-300 rounded-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className=" p-[0.70rem] bg-gray-50  border-gray-300 text-gray-900 sm:text-sm rounded-lg border-none focus-within:border-none focus-within:ring-0 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                  />

                  <div
                    className="px-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon className="w-6 h-6" /> : <EyeSlashIcon className="w-6 h-6" />}
                  </div>
                </div>
                {errors.password && (
                  <p className="text-red-600  text-[11px] pt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>{" "}
              <div className="flex items-center justify-between">
                <div className="flex items-start mb-[-2px]">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>{" "}
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
                <div className="flex items-start"></div>{" "}
                <Link
                  href="/forget-password"
                  className=" mb-[-10px] text-sm font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-600"
                >
                  Forgot password?
                </Link>
              </div>{" "}
              <button
                type="submit"
                className="w-full mt-4 text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
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
                  "Log in"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-600 text-opacity-[1]"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}