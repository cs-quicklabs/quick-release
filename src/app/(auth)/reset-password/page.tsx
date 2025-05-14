"use client";

import { requestHandler, showNotification } from "@/Utils";
import {
  resetPasswordRequest,
  verifyResetTokenRequest,
} from "@/fetchHandlers/authentication";
import Loading from "@/atoms/Loading";
import { AuthType } from "@/types";
import { User } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { WEB_DETAILS } from "@/Utils/constants";
import Image from "next/image";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";
import { Input } from "@/atoms/input";
import Spin from "@/atoms/Spin";

const ResetPassword = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const search = useSearchParams();
  const token = search.get("token");
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const formSchema = z
    .object({
      password: z.string().trim().min(1, { message: "Required" }),

      confirmPassword: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .min(8, { message: "Password should be minimum 8 characters" }),
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
    } as AuthType;

    await requestHandler(
      () => resetPasswordRequest(data),
      setLoader,
      (res: any) => {
        const { message } = res;
        showNotification("success", message);
        router.push("/");
      },
      (err: any) => {
        showNotification("error", err);
      }
    );
  };

  useEffect(() => {
    const verifyToken = async () => {
      toast.dismiss();
      if (token) {
        await requestHandler(
          async () => await verifyResetTokenRequest({ token }),
          setLoader,
          (res: any) => {
            setUser(res.data);
          },
          (err: any) => {
            toast.error(err);
            router.push("/");
          }
        );
      }
    };
    verifyToken();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      {user !== null ? (
        <>
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
            {WEB_DETAILS.name}
          </Link>{" "}
          <div className="w-full bg-white rounded-lg shadow-sm dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                {"Set a new password"}
              </h2>
              <form
                className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
                onSubmit={handleSubmit(resetPassword)}
              >
                <div>
                  <label htmlFor="email" className="form-input-label">
                    {"New Password"}
                  </label>{" "}
                  <div className="flex items-center  bg-gray-50 border border-gray-300 rounded-xs">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      placeholder="••••••••"
                      {...register("password")}
                      className="border-none"
                    />

                    <div
                      className="px-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-6 h-6" />
                      ) : (
                        <EyeIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                  {errors.password && (
                    <span className="text-red-600 text-[12px]">
                      {errors.password.message}
                    </span>
                  )}
                </div>{" "}
                <div className="mb-0">
                  <label
                    htmlFor="confirm-password"
                    className="form-input-label"
                  >
                    {"Change password"}
                  </label>{" "}
                  <Input
                    type="password"
                    id="confirm-password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600  text-[11px] pt-1">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loader}
                  className={`btn-primary w-full mt-4 mb-5 ${
                    loader ? "bg-blue-400" : ""
                  }`}
                >
                  {loader ? (
                    <div className="flex items-center justify-center gap-4">
                      <Spin className="h-[25px] w-[25px]" />
                    </div>
                  ) : (
                    "Set Password"
                  )}{" "}
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-center">
                  <Link
                    href="/"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Return back to Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default ResetPassword;
