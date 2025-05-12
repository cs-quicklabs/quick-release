"use client";

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { requestHandler, showNotification } from "@/Utils";
import {
  resendVerificationLinkRequest,
  verifyRegisterTokenRequest,
} from "@/fetchHandlers/authentication";
import AlertModal from "./AlertModal";
import Image from "next/image";
import { WEB_DETAILS } from "@/Utils/constants";
import { Input } from "@/atoms/input";
import Spin from "@/atoms/Spin";
import { Checkbox } from "flowbite-react";

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
      .email({ message: "Invalid email address" })
      .transform((value) => value.toLowerCase()),
    password: z.string().trim().min(1, { message: "Required" }),
    remember: z.boolean().optional(),
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
      if (res?.error) {
        handleLoginError(res.error, values.email);
      } else {
        router.push("/allLogs");
      }
    } catch {
      toast.error("Invalid Credentials");
    } finally {
      setLoader(false);
    }
  }

  function handleLoginError(error: string, email?: string) {
    if (error === "Incorrect Credentials!") {
      toast.error(error);
    } else if (error === "Your Account is not Verified Yet, Check Email") {
      setUserEmail(email!);
      setIsOpen(true);
    } else {
      toast.error("An unknown error occurred");
    }
  }

  useEffect(() => {
    if (token) {
      const verifyToken = async () => {
        await requestHandler(
          async () => await verifyRegisterTokenRequest({ token }),
          setLoader,
          (res: any) => {
            const { message } = res;
            showNotification("success", message);
          },
          (errMessage) => {
            showNotification("error", errMessage);
          }
        );
      };
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
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <Link
        href="/"
        className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
      >
        <Image
          className="w-8 h-8 mr-2"
          src={WEB_DETAILS.favicon}
          alt="logo"
          width={32}
          height={32}
        />
        {WEB_DETAILS.name}
      </Link>
      <div className="w-full bg-white rounded-xs shadow-sm  md:mt-0 sm:max-w-md xl:p-0 ">
        <div className="p-6 space-y-4 md:space-y-4 sm:p-8">
          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
            {"Sign in to your account"}
          </h1>{" "}
          <form
            className="space-y-4 md:space-y-4"
            onSubmit={handleSubmit(loginUser)}
          >
            <div>
              <label htmlFor="email" className="form-input-label">
                {"Your email"}
              </label>{" "}
              <Input
                type="email"
                id="email"
                placeholder="name@company.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-600 text-[12px]" id="login-error">
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
                  onClickOk={async () => {
                    await resendEmail();
                    setIsOpen(false);
                  }}
                  onClickCancel={() => setIsOpen(false)}
                />
              )}
            </div>{" "}
            <div>
              <label htmlFor="password" className="form-input-label ">
                {"Password"}
              </label>{" "}
              <div className="flex items-center form-input-field p-0">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  className="border-none"
                  {...register("password")}
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
                <p className="text-red-600  text-[11px] pt-1">
                  {errors.password.message}
                </p>
              )}
            </div>{" "}
            <div className="flex items-center justify-between mb-0">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="remember"
                    {...register("remember")}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 "
                  />
                </div>{" "}
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-500 ">
                    {"Remember me"}
                  </label>
                </div>
              </div>
              <div className="flex items-start"></div>{" "}
              <Link
                href="/forget-password"
                className="text-sm font-medium  hover:underline  text-blue-600"
                id="forget-password"
              >
                {"Forgot password?"}
              </Link>
            </div>{" "}
            <button
              type="submit"
              id="login"
              disabled={loader}
              className={`btn-primary w-full mt-4 ${
                loader ? "bg-blue-400" : ""
              }`}
            >
              {loader ? (
                <div className="flex items-center justify-center gap-4">
                  <Spin className="h-[25px] w-[25px]" />
                </div>
              ) : (
                "Sign in"
              )}
            </button>
            <p className="text-sm font-light text-gray-500  flex justify-center">
              {"Don’t have an account yet? "}&nbsp;
              <Link
                href="/register"
                className="font-medium  hover:underline  text-blue-600 text-opacity-[1]"
              >
                {"Sign up"}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
