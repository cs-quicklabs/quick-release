"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { Oval } from "react-loader-spinner";

const Projects = () => {
  const { data } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = (data?.user as { id: string })?.id;

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
  console.log(projects);
  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await getProjects();
      }
    };

    fetchData();
  }, [userId]);
  return (
    <div className="flex items-center justify-center text-center h-[100vh] gap-5">
      {loading ? (
        <Oval color="#FFFFFF" secondaryColor="#000000" />
      ) : (
        projects?.map((item: any) => {
          return (
            <div className="border shadow-xl px-4 py-16 rounded-xl bg-blue-100 text-black font-bold w-40 h-40 cursor-pointer">
              <p className="">{item?.name}</p>
            </div>
          );
        })
      )}

      <Link
        href={"/create-project"}
        className="border shadow-xl px-4 py-16 rounded-xl bg-blue-100 text-black font-bold w-40 h-40 cursor-pointer"
      >
        <div className="flex flex-col items-center justify-center">
          <p className="pb-1">Add Project</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-16"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </Link>
    </div>
  );
};

export default Projects;
