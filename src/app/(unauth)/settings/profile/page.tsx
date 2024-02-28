"use client";

import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

const Profile = () => {
  const [activeUser, setActiveUser] = useState<User>();
  const [selectedFile, setSelectedFile] = useState();
  const [fileName, setFileName] = useState();
  const [loading, setLoading] = useState({
    profileLoading: false,
    imageUploadLoading: false,
  });
  const formSchema = z.object({
    firstName: z.string().min(1, { message: "Required" }).max(50, {
      message: "Fisrt Name can be maximum 50 characters",
    }),
    lastName: z.string().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    profilePicture: z.unknown(),
  });

  const getActiveUser = async () => {
    try {
      const res = await axios.get("/api/get-active-user");
      setActiveUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getActiveUser();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: activeUser?.firstName as string,
      lastName: activeUser?.lastName as string,
      email: activeUser?.email as string,
      profilePicture: fileName,
    },
  });

  useEffect(() => {
    const setDefaultValues = () => {
      if (activeUser) {
        reset({
          firstName: activeUser.firstName as string,
          lastName: activeUser.lastName as string,
          email: activeUser.email as string,
        });
      }
    };

    setDefaultValues();
  }, [activeUser]);

  const defaultValues = getValues();

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      await uploadImage(file, event);
    } else {
      console.error("No file selected.");
    }
  };

  const uploadImage = async (file: any, event: any) => {
    event.preventDefault();

    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        imageUploadLoading: true,
      }));
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/api/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFileName(response.data.fileName);
      setLoading((prevLoading) => ({
        ...prevLoading,
        imageUploadLoading: false,
      }));
      console.log("Image uploaded successfully:", response);
    } catch (error) {
      console.error("Error uploading image:", error);

      setLoading((prevLoading) => ({
        ...prevLoading,
        imageUploadLoading: false,
      }));
    }
  };

  const updateProfile = async (values: z.infer<typeof formSchema>, e: any) => {
    try {
      setLoading((prevLoading) => ({
        ...prevLoading,
        profileLoading: true,
      }));
      await axios.post(`/api/update-profile/${activeUser?.id}`, {
        ...values,
        profilePicture: fileName,
      });
      setLoading((prevLoading) => ({
        ...prevLoading,
        profileLoading: false,
      }));
      toast.success("Profile Updated Successfully");
    } catch (err: any) {
      console.log("error", err);
      setLoading((prevLoading) => ({
        ...prevLoading,
        profileLoading: false,
      }));
      toast.error(err.response.data.message);
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
                onSubmit={handleSubmit(updateProfile)}
              >
                <div className="sm:col-span-2">
                  <label
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    htmlFor="file_input"
                  >
                    Upload avatar
                  </label>{" "}
                  <div className="items-center w-full sm:flex">
                    {loading.imageUploadLoading ? (
                      <Oval
                        height={25}
                        width={25}
                        color="black"
                        secondaryColor="white"
                      />
                    ) : (
                      <>
                        <img
                          alt="No Image"
                          className="w-20 h-20 mb-4 rounded-full sm:mr-4 sm:mb-0"
                          src={fileName}
                          height={20}
                          width={20}
                        />
                        <input
                          type="file"
                          accept="image/jpg*"
                          onChange={handleFileChange}
                        />
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
                    "Update"
                  )}
                </button>
              </form>
            </div>
          </main>
        </div>
      </main>
    </BaseTemplate>
  );
};

export default Profile;
