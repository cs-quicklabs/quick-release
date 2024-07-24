"use client";

import { requestHandler, showNotification } from "@/Utils";
import { resetPasswordRequest, verifyResetTokenRequest } from "@/fetchHandlers/authentication";
import Loader from "@/components/Loader";
import Loading from "@/components/Loading";
import { AuthType } from "@/types";
import { User } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";
import { WEB_DETAILS } from "@/Utils/constants";
import Image from "next/image";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "lucide-react";

const ResetPassword = ({ params }: { params: { token: string } }) => {
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
                      {showPassword ? (
                        <EyeSlashIcon className="w-6 h-6" />
                      ) : (
                        <EyeIcon className="w-6 h-6" />
                      )}
                    </div>
                  </div>
                </div>{" "}
                {errors.password && (
                  <span className="text-red-600 text-[12px]">
                    {errors.password.message}
                  </span>
                )}
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
                    <p className="text-red-600  text-[11px] pt-1">
                      {errors.confirmPassword.message}
                    </p>
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
                    "Set Password"
                  )}{" "}
                </button>
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
