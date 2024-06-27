"use client";

import { requestHandler, showNotification } from "@/Utils";
import { fileUploadRequest } from "@/fetchHandlers/fileUpload";
import { useUserContext } from "@/app/context/UserContext";
import Modal from "@/components/Modal";
import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";
import { User } from "@/interfaces";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

const Profile = () => {
  const router = useRouter();
  const { loggedInUser } = useUserContext();
  const [fileName, setFileName] = useState<any>(loggedInUser?.profilePicture);
  const [isOpenImageModal, setIsOpenImageModal] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [loading, setLoading] = useState({
    profileLoading: false,
  });
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
      profilePicture: fileName,
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

  const formValues = getValues();

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      await uploadImage.upload(file);
    } else {
      console.error("No file selected.");
    }
  };

  const uploadImage = useMemo(() => ({
    upload: (file: File) => {
      return new Promise(async (resolve, reject) => {
        // check if valid image exists
        const extension = file.name.toLowerCase().split('.').pop();
        if (!["png", "jpg", "jpeg"].includes(extension!)) {
          const errMessage = "Invalid file type";
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
            setFileName(res.data.url);
            showNotification("success", res?.message);
          },
          (errMessage) => {
            showNotification("error", errMessage);
            reject(errMessage);
          }
        );
      });
    }
  }), []);

  const updateProfile = async (
    values: z.infer<typeof formSchema>,
    isEmailUpdate = false
  ) => {
    toast.dismiss();
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        profileLoading: true,
      }));
      await axios.post(`/api/update-profile/${loggedInUser?.id}`, {
        ...values,
        profilePicture: fileName,
      });

      toast.success("Profile Updated Successfully");

      if (isEmailUpdate) {
        await signOut({ redirect: false });
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      console.log("error", err);

      toast.error(err.response.data.message);
    } finally {
      setLoading((prevLoading) => ({
        ...prevLoading,
        profileLoading: false,
      }));
    }
  };

  const updateProfileDetails = async (
    values: z.infer<typeof formSchema>,
    e: any
  ) => {
    if (loggedInUser?.email === values.email) {
      updateProfile(values);
      window.location.reload();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsNav />
          <main className="max-w-xl pb-12 px-4 lg:col-span-6">
            <div>
              <h1 className="text-lg font-semibold dark:text-white">
                Profile Settings
              </h1>{" "}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Change your personal profile settings
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
                    Upload avatar
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
                        {fileName ? (
                          <>
                            <div className="flex ">
                              <label htmlFor="fileInput">
                                <img
                                  alt="No Image"
                                  className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                                  src={fileName}
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
                              <img
                                alt="No Image"
                                className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0 cursor-pointer"
                                src="/images/userAvatar.png"
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
                    First Name
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
                    Last Name
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
                    Email
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
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {loading.profileLoading ? (
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
              {isOpen ? (
                <Modal
                  open={isOpen}
                  setIsOpen={setIsOpen}
                  buttonText="Ok"
                  title="Re-verification Email"
                  onClick={() => {
                    setIsOpen(false);
                    updateProfile(formValues, true);
                  }}
                  loading={loading.profileLoading}
                >
                  <div>Are you sure you want to change your email address?</div>
                </Modal>
              ) : null}
              {isOpenImageModal ? (
                <Modal
                  open={isOpenImageModal}
                  setIsOpen={setIsOpenImageModal}
                  buttonText="OK"
                  title="Remove Profile Picture ?"
                  onClick={() => {
                    setIsOpenImageModal(false);
                    setFileName(null);
                  }}
                  loading={loading.profileLoading}
                ></Modal>
              ) : null}
            </div>
          </main>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default Profile;

