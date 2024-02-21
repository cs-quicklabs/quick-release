"use client";

import BaseTemplate from "@/templates/BaseTemplate";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";
import { z } from "zod";

const Project = () => {
  const { data } = useSession();
  const router = useRouter();
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const userId = (data?.user as { id: string })?.id;

  const [loader, setLoader] = useState(false);
  const formSchema = z.object({
    projects: z.string().min(3, { message: "Required" }),
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

  const getProjects = async () => {
    setLoading(true);
    try {
      const projects = await axios.get(`/api/get-projects/${userId}`);
      setProjects(projects.data);
    } catch (err) {
      console.log(err, "error");
    }
    setLoading(false);
  };
  React.useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await getProjects();
      }
    };

    fetchData();
  }, [userId]);

  async function createProject(values: any, e: any) {
    e.preventDefault();
    try {
      setLoader(true);
      const response = await axios.post(`api/add-project/${userId}`, {
        projects: values.projects.trim(),
      });
      toast.success(response.data.message);
      router.push("/allLogs");
      getProjects();
    } catch (error: any) {
      if (error) {
        toast.error(error.response.data.message);
      }
    }
    setLoader(false);
  }

  return (
    <BaseTemplate>
      <main className="mx-auto max-w-4xl pb-10 lg:py-12 lg:px-8 md:py-8 md:px-4 bg-gray-50">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Create Your Project
            </h3>{" "}
            <div className="mt-2 w-full text-sm text-gray-500">
              <p>
                Please select a name your team. This will be used as slug to
                create a URL for your product as well.
              </p>
            </div>{" "}
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={handleSubmit(createProject)}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="email" className="sr-only">
                  Email
                </label>{" "}
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    release.quicklabs.in/
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
              <button
                type="submit"
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
                  "Create Project"
                )}{" "}
              </button>
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
