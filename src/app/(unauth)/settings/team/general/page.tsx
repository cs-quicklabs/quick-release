"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import Image from "next/image";
import { WEB_DETAILS } from "@/Utils/constants";
import { useProjectContext } from "@/app/context/ProjectContext";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/atoms/button";
import { Tooltip } from "flowbite-react";
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid";
import Loading from "@/atoms/Loading";
import { deleteFiles, uploadFile } from "@/fetchHandlers";

const GeneralTeamSettings = () => {
  const fileInputRef = useRef(null);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [teamLogoUrl, setTeamLogoUrl] = useState<any>(null);
  const [loader, setLoader] = useState(false);

  const {
    activeProjectId,
    isLoading: updateLoading,
    getActiveProject,
    map: projectMap,
    updateProjectDetails,
  } = useProjectContext();

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setLoader);
    }
  }, [activeProjectId]);

  const formSchema = z.object({
    name: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Team name can be maximum 50 characters",
    }),
    slug: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    watch,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: projectMap[activeProjectId!]?.name,
      slug: projectMap[activeProjectId!]?.slug,
    },
  });

  useEffect(() => {
    const setDefaultValues = () => {
      if (activeProjectId) {
        reset({
          name: projectMap[activeProjectId!]?.name,
          slug: projectMap[activeProjectId!]?.slug,
        });
      }
    };

    if (activeProjectId) {
      setTeamLogoUrl(projectMap[activeProjectId!]?.projectImgUrl);
    }
    setDefaultValues();
  }, [activeProjectId]);

  const formValues = watch();

  const hasChanged = useMemo(() => {
    return (
      formValues.name !== projectMap[activeProjectId!]?.name ||
      projectMap[activeProjectId!]?.projectImgUrl !== teamLogoUrl
    );
  }, [formValues, projectMap[activeProjectId!]]);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const imageUrl = await uploadFile(
        file,
        "ProjectImgs",
        setImageUploadLoading
      );
      if (imageUrl && activeProjectId) {
        updateProjectDetails({
          id: activeProjectId!,
          projectImgUrl: imageUrl,
        });
        setTeamLogoUrl(imageUrl);
      }
    }
  };

  const handleUpdateProject = async (
    values: z.infer<typeof formSchema>,
    e: any
  ) => {
    await updateProjectDetails({
      ...values,
      id: activeProjectId!,
    });
  };

  const handleDeleteTeamLogo = async () => {
    deleteFiles([teamLogoUrl], "ProjectImgs", setImageUploadLoading);
    if (!imageUploadLoading && activeProjectId) {
      updateProjectDetails({
        id: activeProjectId!,
        projectImgUrl: null,
      });
      setTeamLogoUrl(null);
      setIsOpenImageModal(false);
    }
  };

  if (!activeProjectId && loader) {
    return (
      <main className="pb-12 px-4 col-span-12 lg:col-span-7">
        <Loading />
      </main>
    );
  }

  return (
    <main className="pb-12 px-4 col-span-12 lg:col-span-7">
      <div>
        <h1 className="text-lg font-semibold dark:text-white">
          {"Team Settings"}
        </h1>{" "}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {"Change settings of your team."}
        </p>{" "}
        <form
          className="w-full mt-6"
          onSubmit={handleSubmit(handleUpdateProject)}
        >
          <div className="sm:col-span-2">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              {"Upload Team Logo"}
            </label>{" "}
            <div className="items-center w-full sm:flex">
              {imageUploadLoading ? (
                <Oval
                  height={25}
                  width={25}
                  color="black"
                  secondaryColor="white"
                />
              ) : (
                <>
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
                          onChange={(e) => handleFileChange(e)}
                        />
                        <XMarkIcon
                          className="ml-[-10px] cursor-pointer"
                          onClick={() => setIsOpenImageModal(true)}
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
                      />
                    </>
                  )}
                </>
              )}
            </div>
          </div>{" "}
          <div className="mb-5 mt-6">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {"Team Name"}
            </label>{" "}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Team Name"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-red-600 text-[12px]">
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
                  content="Slug specifies the unique identifier for your team. It is used to create a unique URL for your team. You can use letters, numbers, and hyphens."
                  placement="right"
                >
                  <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500 hover:text-gray-900" />
                </Tooltip>
                <span className="sr-only">Show information</span>
              </button>{" "}
            </label>
            <input
              type="text"
              disabled
              className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Slug"
              {...register("slug")}
            />
          </div>{" "}
          <Button
            type="submit"
            disabled={updateLoading || !hasChanged}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full lg:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {updateLoading ? (
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
        <AlertModal
          show={isOpenImageModal}
          title={`Remove Team logo ?`}
          message={"Are you sure you want to remove your team logo?"}
          onClickCancel={() => setIsOpenImageModal(false)}
          okBtnClassName={"bg-red-600 hover:bg-red-800"}
          spinClassName={"!fill-red-600"}
          onClickOk={() => handleDeleteTeamLogo()}
          loading={imageUploadLoading}
        />
      </div>
    </main>
  );
};

export default GeneralTeamSettings;
