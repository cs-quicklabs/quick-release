"use client";

import { useProjectContext } from "@/app/context/ProjectContext";
import BaseTemplate from "@/templates/BaseTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import { Button } from "@/atoms/button";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "flowbite-react";
import { WEB_DETAILS } from "@/Utils/constants";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { deleteFiles, uploadFile } from "@/fetchHandlers";
import { showNotification } from "@/Utils";
import { Input } from "@/atoms/input";

const Project = () => {
  const router = useRouter();
  const { createProject, isLoading: loader } = useProjectContext();
  const [file, setFile] = useState<any>(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [teamLogoUrl, setTeamLogoUrl] = useState<any>(null);
  const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Team name can be maximum 30 characters",
    }),
    slug: z
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
      name: "",
      slug: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    const extension = selectedFile?.name.toLowerCase().split(".").pop();
    if (selectedFile) {
      if (!["png", "jpg", "jpeg"].includes(extension!)) {
        const errMessage = "Invalid file type";
        showNotification("error", errMessage);
        return;
      }
      setTeamLogoUrl(URL.createObjectURL(selectedFile)); // Preview the image
      setFile(selectedFile); // Store the actual file for later upload
    }
  };

  const createProjectRequestHandler = async (
    data: z.infer<typeof formSchema>
  ) => {
    let imageUrl = null;
    if (file) {
      // Upload the file only if it's selected
      imageUrl = await uploadFile(file, "ProjectImgs", setImageUploadLoading);
    }

    // Create the project
    createProject({ ...data, projectImgUrl: imageUrl } as any);
  };

  const handleDeleteImage = async () => {
    setTeamLogoUrl(null); // Remove preview
    setFile(null); // Remove file reference
  };

  return (
    <BaseTemplate>
      <main className="mx-auto max-w-4xl pb-10 lg:py-12 lg:px-8 md:py-8 md:px-4">
        <div className=" shadow sm:rounded-lg bg-white">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              {"Create Your Team"}
            </h3>{" "}
            <div className="mt-2 w-full text-sm text-gray-500">
              <p>
                {
                  "Please select a name your team. This will be used as slug to create a URL for your product as well."
                }
              </p>
            </div>{" "}
            <form
              className="mt-5 sm:flex sm:flex-col"
              onSubmit={handleSubmit(createProjectRequestHandler)}
            >
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file_input"
              >
                {"Upload Team Logo"}
              </label>{" "}
              <div className="flex items-center">
                {teamLogoUrl ? (
                  <>
                    <div className="flex ">
                      <label htmlFor="fileInput">
                        <Image
                          alt="No Image"
                          className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                          src={teamLogoUrl}
                          height={20}
                          width={20}
                        />
                      </label>
                      <input
                        id="fileInput"
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        onClick={(e: any) => (e.target.value = "")}
                      />
                      <XMarkIcon
                        className="ml-[-10px] cursor-pointer"
                        onClick={handleDeleteImage}
                        height={"20px"}
                        width={"20px"}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <label htmlFor="fileInput">
                      <Image
                        alt="No Image"
                        className="w-20 h-20 mb-4 border border-gray-300 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                        src={WEB_DETAILS.logo}
                        height={20}
                        width={20}
                      />
                    </label>
                    <input
                      id="fileInput"
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      onClick={(e: any) => (e.target.value = "")}
                    />
                  </>
                )}
              </div>
              <div className="mb-5 mt-6">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {"Team Name"}
                </label>{" "}
                <Input
                  type="text"
                  id="team-name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Team Name"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-600 text-[12px]" id="errorTeam">
                    {errors.name.message}
                  </span>
                )}
              </div>{" "}
              <div className="mb-5">
                <label
                  htmlFor="user-permissions"
                  className="inline-flex items-center mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Slug
                  <button
                    type="button"
                    data-tooltip-target="tooltip-dark"
                    data-tooltip-style="dark"
                    className="ml-1"
                  >
                    <Tooltip
                      className="text-xs w-[21.75rem] text-left"
                      content="Slug specifies the unique identifier for your team. It is used to create a unique URL for your team. You can use letters, numbers, and hyphens."
                      placement="top"
                    >
                      <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                    </Tooltip>
                    <span className="sr-only">Show information</span>
                  </button>{" "}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    {"release.quicklabs.in/"}
                  </span>{" "}
                  <Input
                    type="text"
                    {...register("slug")}
                    id="company-website"
                    className="border block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="skia"
                  />
                </div>
                {errors.slug && (
                  <span className="text-red-600 text-[12px]" id="errorSlug">
                    {errors.slug.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                disabled={
                  loader || errors.slug
                    ? true
                    : false || errors.name
                    ? true
                    : false
                }
                id="saveProject"
                className="text-white bg-blue-700 max-w-[4rem] hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default Project;
