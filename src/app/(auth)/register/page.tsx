"use client";

import { requestHandler, showNotification } from "@/Utils";
import { registerUserRequest } from "@/fetchHandlers/authentication";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
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

      lastName: z.string().trim().min(1, { message: "Required" }).max(50, {
        message: "Last Name can be maximum 50 characters",
      }),
      email: z
        .string()
        .trim()
        .min(1, { message: "Required" })
        .email({ message: "Invalid email address" }),
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
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Quick Release
        </Link>{" "}
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-4">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create your account
            </h1>{" "}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(createUser)}
            >
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div>
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    First Name
                  </label>{" "}
                  <input
                    type="text"
                    id="first-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-600 dark:focus:border-blue-600"
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
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Last Name
                  </label>{" "}
                  <input
                    type="text"
                    id="last-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                  <span className="text-red-600 text-[11px] pt-1">
                    {errors.email.message}
                  </span>
                )}
              </div>{" "}
              <div>
                <label
                  htmlFor="company-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Organization Name
                </label>{" "}
                <input
                  type="text"
                  id="organisation-name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirm Password
                </label>{" "}
                <div className="flex items-center focus-within:border-2 focus-within:border-blue-600 bg-gray-50 border border-gray-300 rounded-lg">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    className=" p-[0.70rem] bg-gray-50  border-gray-300 text-gray-900 sm:text-sm rounded-lg border-none focus-within:border-none focus-within:ring-0 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
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
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    {...register("terms")}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                  />
                </div>{" "}
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-600"
                      href="#"
                    >
                      Terms and Conditions
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
                    "Create an account"
                  )}
                </button>
              </a>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500 text-blue-600"
                >
                  Login here
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
