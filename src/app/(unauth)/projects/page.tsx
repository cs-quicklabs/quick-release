"use client";

import { PlusCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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
          <PlusCircleIcon className="w-8 h-8" />
        </div>
      </Link>
    </div>
  );
};

export default Projects;
