"use client";

import { requestHandler, showNotification } from "@/Utils";
import { WEB_DETAILS } from "@/Utils/constants";
import Spin from "@/atoms/Spin";
import { Input } from "@/atoms/input";
import { registerUserRequest } from "@/fetchHandlers/authentication";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Register = () => {
  const [loader, setLoader] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const formSchema = z
    .object({
      firstName: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .min(2, { message: "First name should be minimum 2 characters" })
        .max(50, { message: "First Name can be maximum 50 characters" })
        .refine((value) => value.length > 0 && /^[a-zA-Z ]+$/.test(value), {
          message: "First name can only contain letters",
        }),

      lastName: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .max(50, {
          message: "Last Name can be maximum 50 characters",
        })
        .refine((value) => value.length > 0 && /^[a-zA-Z ]+$/.test(value), {
          message: "Last name can only contain letters",
        }),
      email: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .email({ message: "Invalid email address" })
        .transform((value) => value.toLowerCase()),
      orgName: z.string().trim().min(1, { message: "Required" }),
      terms: z.boolean(),
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
    })
    .superRefine(({ terms }, ctx) => {
      if (terms !== true) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["terms"],
          message: "You have to accept terms and condtions",
        });
      }
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      orgName: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function createUser(values: z.infer<typeof formSchema>) {
    await requestHandler(
      async () => await registerUserRequest(values),
      setLoader,
      (res: any) => {
        const { message } = res;
        showNotification("success", message);
        router.push("/");
      },
      (errMessage) => {
        showNotification("error", errMessage);
      }
    );
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-12 mx-auto ">
        <Link
          href="/"
          className="flex items-center mb-6  mt-8 text-2xl font-medium text-gray-900 dark:text-white"
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
        <div className="w-full bg-white rounded-xs shadow-sm dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-4">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {"Create your account"}
            </h1>{" "}
            <form
              className="space-y-4 md:space-y-5"
              onSubmit={handleSubmit(createUser)}
            >
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label htmlFor="first-name" className="form-input-label">
                    {"First Name"}
                  </label>{" "}
                  <Input
                    type="text"
                    id="first-name"
                    placeholder="First name"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-[11px] pt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="last-name" className="form-input-label">
                    {"Last Name"}
                  </label>{" "}
                  <Input
                    type="text"
                    id="last-name"
                    placeholder="Last name"
                    {...register("lastName")}
                  />
                  {errors.lastName && (
                    <span className="text-red-600 text-[11px] pt-1">
                      {errors.lastName.message}
                    </span>
                  )}
                </div>
              </div>{" "}
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
                  <span className="text-red-600 text-[11px] pt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>{" "}
              <div>
                <label htmlFor="company-name" className="form-input-label">
                  {"Organization Name"}
                </label>{" "}
                <Input
                  type="text"
                  id="organisation-name"
                  placeholder="Company name"
                  {...register("orgName")}
                />
                {errors.orgName && (
                  <span className="text-red-600 text-[11px] pt-1">
                    {errors.orgName.message}
                  </span>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {"Password"}
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
                      <EyeIcon className="w-6 h-6" />
                    ) : (
                      <EyeSlashIcon className="w-6 h-6" />
                    )}
                  </div>
                </div>
                {errors.password && (
                  <span className="text-red-600 text-[11px] pt-1">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="form-input-label">
                  {"Confirm Password"}
                </label>{" "}
                <div className="flex items-center  bg-gray-50 border border-gray-300 rounded-xs">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className=" border-none"
                  />

                  <div
                    className="px-4 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="w-6 h-6" />
                    ) : (
                      <EyeSlashIcon className="w-6 h-6" />
                    )}
                  </div>
                </div>
                {errors.confirmPassword && (
                  <span className="text-red-600 text-[11px] pt-1">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>{" "}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <Input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 appearance-auto"
                  />
                </div>{" "}
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    {"I accept the "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      {"Terms and Conditions"}
                    </a>
                  </label>
                </div>
              </div>{" "}
              {errors.terms && (
                <span className="text-red-600 text-[11px] pt-1">
                  {errors.terms.message}
                </span>
              )}
              <a href="/quick-release/signup/team" className="mt-4">
                <button
                  type="submit"
                  disabled={loader}
                  className={`${
                    loader ? "bg-blue-400" : ""
                  } w-full btn-primary`}
                >
                  {loader ? (
                    <div className="flex items-center justify-center gap-4">
                      <Spin className="h-[25px] w-[25px]" />
                    </div>
                  ) : (
                    "Create an account"
                  )}
                </button>
              </a>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 flex justify-center mt-5">
                <Link
                  href="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  {" Return back to Log in"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
