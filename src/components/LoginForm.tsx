"use client";

import Modal from "./Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

export default function LoginForm() {
  const router = useRouter();
  const params = useParams();
  const search = useSearchParams();
  const token = search.get("token");

  const [loader, setLoader] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(8, { message: "Password should be minimum 8 characters" }),
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
    try {
      setLoader(true);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      if (!res?.error) {
        router.push("/allLogs");
      } else {
        toast.error(res?.error as string);
        setUserEmail(values.email);
        setIsOpen(true);
      }

      if (!token) {
        setLoader(true);
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        if (!res?.error) {
          router.push("/allLogs");
        } else {
          toast.error(res?.error as string);
          setUserEmail(values.email);
          setIsOpen(true);
        }
      }
    } catch (error) {
      if (error) {
        toast.error(error ? "Invalid Credentials" : "");
      }
    }
    setLoader(false);
  }
  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        try {
          const res = await axios.post("/api/verify-register-token", {
            id: token,
          });
          if (res.data.isVerified === true) {
            setVerifiedUser(true);
          } else {
            setVerifiedUser(false);
          }
        } catch (error) {
          console.log(error);
          setVerifiedUser(false);
        }
      };
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (verifiedUser === true) {
      toast.success("Your account has been verified");
    }
  }, [verifiedUser]);

  const resendEmail = async () => {
    try {
      setResendLoading(true);
      await axios.post(`/api/resend-verification-link/${userEmail}`);
      toast.success("Verification link sent to email");
      setResendLoading(false);
    } catch (e: any) {
      console.log(e, "er");
      toast.error("Email not registered");
      setResendLoading(false);
    }
  };
  return (
    <>
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
                  <Modal
                    open={isOpen}
                    setIsOpen={setIsOpen}
                    buttonText="Resend Verification Link"
                    title="Account Not Confirmed"
                    onClick={resendEmail}
                    loading={resendLoading}
                  >
                    <div>Check your email if already registered</div>
                  </Modal>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>{" "}
                <div className="flex items-center focus-within:border-2 focus-within:border-black focus-within:rounded-lg bg-gray-50 border rounded-lg">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    {...register("password")}
                    className="  bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600bg-gray-50 focus:outline-none block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />

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
                {errors.password && (
                  <span className="text-red-600 text-[12px]">
                    {errors.password.message}
                  </span>
                )}
              </div>{" "}
              <div className="flex items-center justify-between">
                <div className="flex items-start"></div>{" "}
                <Link
                  href="/forget-password"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
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
                  "Sign In"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      ;
    </>
  );
}
