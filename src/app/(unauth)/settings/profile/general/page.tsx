"use client";
import { useUserContext } from "@/app/context/UserContext";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import Image from "next/image";
import { WEB_DETAILS } from "@/Utils/constants";
import { useProjectContext } from "@/app/context/ProjectContext";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/atoms/button";
import { ProfileType } from "@/types";
import { deleteFiles, uploadFile } from "@/fetchHandlers";

const Profile = () => {
  const router = useRouter();
  const {
    loggedInUser,
    updateUserDetails,
    isLoading: updateLoading,
  } = useUserContext();
  const [profileImgUrl, setProfileImgUrl] = useState<any>(
    loggedInUser?.profilePicture
  );
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const { activeProjectId, getActiveProject } = useProjectContext();
  const [isOpen, setIsOpen] = useState(false);
  const formSchema = z.object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .max(50, {
        message: "Fisrt Name can be maximum 50 characters",
      })
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
    profilePicture: z.unknown(),
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
      firstName: loggedInUser?.firstName as string,
      lastName: loggedInUser?.lastName as string,
      email: loggedInUser?.email as string,
      profilePicture: loggedInUser?.profilePicture,
    },
  });

  useEffect(() => {
    const setDefaultValues = () => {
      if (loggedInUser) {
        reset({
          firstName: loggedInUser.firstName as string,
          lastName: loggedInUser.lastName as string,
          email: loggedInUser.email as string,
          profilePicture: loggedInUser.profilePicture,
        });
      }
    };

    setDefaultValues();
  }, [loggedInUser]);

  useEffect(() => {
    if (!activeProjectId) {
      getActiveProject(setLoader);
    }
  }, [activeProjectId]);

  const formValues = watch();

  const hasChanged = useMemo(() => {
    return (
      formValues.firstName !== loggedInUser?.firstName ||
      formValues.lastName !== loggedInUser?.lastName ||
      formValues.email.toLowerCase() !== loggedInUser?.email
    );
  }, [formValues, loggedInUser]);

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const url = await uploadFile(
        file,
        "ProfilePictures",
        setImageUploadLoading
      );

      if (url) {
        updateUserDetails({
          profilePicture: url,
        });
        setProfileImgUrl(url);
      }
    }
  };

  const updateProfileDetails = async (
    values: z.infer<typeof formSchema>,
    e: any
  ) => {
    if (loggedInUser?.email === values.email) {
      updateUserDetails(values as ProfileType);
    } else {
      setIsOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    setIsOpen(false);
    updateUserDetails(formValues as ProfileType);
  };

  const handleDelete = async () => {
    deleteFiles([profileImgUrl], "ProfilePictures", setImageUploadLoading);
    if (!imageUploadLoading) {
      updateUserDetails({
        profilePicture: null,
      });
      setProfileImgUrl(null);
      setIsOpenImageModal(false);
    }
  };

  return (
    <main className="pb-12 px-4 col-span-12 lg:col-span-7">
      <div>
        <h1 className="text-lg font-semibold dark:text-white">
          {"Profile Settings"}
        </h1>{" "}
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {"Change your personal profile settings"}
        </p>{" "}
        <form
          className="w-full mt-6"
          onSubmit={handleSubmit(updateProfileDetails)}
        >
          <div className="sm:col-span-2">
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              {"Upload avatar"}
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
                  {profileImgUrl ? (
                    <>
                      <div className="flex ">
                        <label htmlFor="fileInput">
                          <Image
                            alt="No Image"
                            className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                            src={profileImgUrl}
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
                          className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                          src={WEB_DETAILS.avtar}
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
              {"First Name"}
            </label>{" "}
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="First Name"
              {...register("firstName")}
            />
            {errors.firstName && (
              <span className="text-red-600 text-[12px]">
                {errors.firstName.message}
              </span>
            )}
          </div>{" "}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {"Last Name"}
            </label>{" "}
            <input
              type="text"
              {...register("lastName")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Last Name"
            />
            {errors.lastName && (
              <span className="text-red-600 text-[12px]">
                {errors.lastName.message}
              </span>
            )}
          </div>{" "}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {"Email"}
            </label>{" "}
            <input
              type="email"
              {...register("email")}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="aashish@gmail.com"
            />
            {errors.email && (
              <span className="text-red-600 text-[12px]">
                {errors.email.message}
              </span>
            )}
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
          show={isOpen}
          title={`Re-verification Email`}
          message={"Are you sure you want to change your email address?"}
          onClickCancel={() => setIsOpen(false)}
          okBtnClassName={"bg-red-600 hover:bg-red-800"}
          spinClassName={"!fill-red-600"}
          onClickOk={() => handleUpdateProfile()}
          loading={updateLoading}
        />
        <AlertModal
          show={isOpenImageModal}
          title={`Remove Profile Picture ?`}
          message={"Are you sure you want to remove your profile picture?"}
          onClickCancel={() => setIsOpenImageModal(false)}
          okBtnClassName={"bg-red-600 hover:bg-red-800"}
          spinClassName={"!fill-red-600"}
          onClickOk={handleDelete}
          loading={imageUploadLoading}
        />
      </div>
    </main>
  );
};

export default Profile;
