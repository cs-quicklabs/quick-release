"use client";

import { requestHandler, showNotification } from "@/Utils";
import { useUserContext } from "@/app/context/UserContext";
import { fileUploadRequest } from "@/fetchHandlers/file";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { z } from "zod";
import Image from "next/image";
import { WEB_DETAILS } from "@/Utils/constants";
import { useProjectContext } from "@/app/context/ProjectContext";
import AlertModal from "@/components/AlertModal";
import { fileDeleteRequest } from "@/fetchHandlers/file";

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
    firstName: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Fisrt Name can be maximum 50 characters",
    }),
    lastName: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    profilePicture: z.unknown(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: loggedInUser?.firstName as string,
      lastName: loggedInUser?.lastName as string,
      email: loggedInUser?.email as string,
      profilePicture: profileImgUrl,
    },
  });

  useEffect(() => {
    const setDefaultValues = () => {
      if (loggedInUser) {
        reset({
          firstName: loggedInUser.firstName as string,
          lastName: loggedInUser.lastName as string,
          email: loggedInUser.email as string,
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

  const formValues = getValues();

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      await uploadImage.upload(file);
    } else {
      console.error("No file selected.");
    }
  };

  const uploadImage = useMemo(
    () => ({
      upload: (file: File) => {
        return new Promise(async (resolve, reject) => {
          // check if valid image exists
          const extension = file.name.toLowerCase().split(".").pop();
          if (!["png", "jpg", "jpeg"].includes(extension!)) {
            const errMessage = "Invalid file type";
            showNotification("error", errMessage);
            return reject(errMessage);
          }

          if (file.size > 1024 * 1024 * 3) {
            const errMessage = "File size should be less than 3 MB";
            showNotification("error", errMessage);
            return reject(errMessage);
          }

          const formData = new FormData();
          formData.append("file", file);
          formData.append("onModal", "ProfilePictures");

          await requestHandler(
            async () => await fileUploadRequest(formData),
            setImageUploadLoading,
            (res: any) => {
              setProfileImgUrl(res.data.url);
              updateUserDetails({
                ...formValues,
                profilePicture: res.data.url,
              });
              showNotification("success", res?.message);
            },
            (errMessage) => {
              showNotification("error", errMessage);
              reject(errMessage);
            }
          );
        });
      },
      remove: () => {
        return new Promise(async (resolve, reject) => {
          await requestHandler(
            async () =>
              await fileDeleteRequest([profileImgUrl], "ProfilePictures"),
            setImageUploadLoading,
            (res: any) => {
              setProfileImgUrl("");
              updateUserDetails({ ...formValues, profilePicture: null });
              setProfileImgUrl(null);
              showNotification("success", res?.message);
            },
            (errMessage) => {
              showNotification("error", errMessage);
              reject(errMessage);
            }
          );
        });
      },
    }),
    []
  );

  const updateProfileDetails = async (
    values: z.infer<typeof formSchema>,
    e: any
  ) => {
    if (loggedInUser?.email === values.email) {
      updateUserDetails({ ...values, profilePicture: profileImgUrl });
    } else {
      setIsOpen(true);
    }
  };

  const handleUpdateProfile = async () => {
    setIsOpen(false);
    updateUserDetails({ ...formValues, profilePicture: profileImgUrl });
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
          <button
            type="submit"
            disabled={updateLoading}
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
          </button>
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
        {/* // <Modal
          //   open={isOpenImageModal}
          //   setIsOpen={setIsOpenImageModal}
          //   buttonText="OK"
          //   title="Remove Profile Picture ?"
          //   onClick={() => {
          //     setIsOpenImageModal(false);
          //     setProfileImgUrl(null);
          //   }}
          //   loading={loading.profileLoading}
          // ></Modal> */}
        <AlertModal
          show={isOpenImageModal}
          title={`Remove Profile Picture ?`}
          message={"Are you sure you want to remove your profile picture?"}
          onClickCancel={() => setIsOpenImageModal(false)}
          okBtnClassName={"bg-red-600 hover:bg-red-800"}
          spinClassName={"!fill-red-600"}
          onClickOk={() => {
            uploadImage.remove();
            setIsOpenImageModal(false);
          }}
          loading={imageUploadLoading}
        />
      </div>
    </main>
  );
};

export default Profile;
