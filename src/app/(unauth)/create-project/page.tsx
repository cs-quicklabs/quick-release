"use client";

import { useProjectContext } from "@/app/context/ProjectContext";
import BaseTemplate from "@/templates/BaseTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";
import { useUserContext } from "@/app/context/UserContext";
import { requestHandler, showNotification } from "@/Utils";
import { createProjectRequest, setActiveProjectRequest } from "@/fetchHandlers/project";
import { Button } from "@/atoms/button";

const Project = () => {
  const router = useRouter();
  const { createProject, isLoading: loader } = useProjectContext();
  const formSchema = z.object({
    projects: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .min(3, { message: "Minimun 3 characters required" })
      .max(30, { message: "Maximum 30 characters allowed" })
      .toLowerCase()
      .refine((value) => /^[a-zA-Z0-9\-.]+$/.test(value), {
        message:
          "Only letters, numbers, hyphens (-), and periods (.) are allowed",
      }),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projects: "",
    },
  });

  const createProjectRequestHandler = async (data: z.infer<typeof formSchema>) => {
    createProject(data as any);  
  };

  return (
    <BaseTemplate>
      <main className="mx-auto max-w-4xl pb-10 lg:py-12 lg:px-8 md:py-8 md:px-4">
        <div className=" shadow sm:rounded-lg bg-white">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {"Create Your Project"}
            </h3>{" "}
            <div className="mt-2 w-full text-sm text-gray-500">
              <p>
                {"Please select a name your team. This will be used as slug to create a URL for your product as well."}
              </p>
            </div>{" "}
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={handleSubmit(createProjectRequestHandler)}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="email" className="sr-only">
                  {"Email"}
                </label>{" "}
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    {"release.quicklabs.in/"}
                  </span>{" "}
                  <input
                    type="text"
                    {...register("projects")}
                    id="company-website"
                    className="border block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="skia"
                  />
                </div>
              </div>{" "}
              <Button
                type="submit"
                disabled={loader || errors.projects ? true : false}
                className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
                  "Save"
                )}{" "}
              </Button>
            </form>{" "}
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errors.projects?.message}
            </p>
          </div>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default Project;

