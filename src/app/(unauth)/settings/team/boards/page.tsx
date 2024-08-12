"use client";
import React, { useEffect, useState } from "react";
import AddFeedbackBoard from "./components/AddFeedbackBoard";
import FeedbackBoardTable from "./components/FeedbackBoardTable";
import { useUserContext } from "@/app/context/UserContext";
import { useProjectContext } from "@/app/context/ProjectContext";

const BoardsPage = () => {
  const { getLoggedInUserDetails } = useUserContext();
  const [loader, setLoader] = useState(false);
  const { activeProjectId, getActiveProject } = useProjectContext();

  useEffect(() => {
    getLoggedInUserDetails();
  }, []);

  useEffect(() => {
    getActiveProject(setLoader);
  }, [activeProjectId]);
  return (
    <main className="h-full overflow-y-auto max-w-3xl pb-12 px-4 lg:col-span-7 no-scrollbar">
      <h1 className="text-lg font-semibold">{"Feedback Boards"}</h1>

      <p className="text-gray-500 text-sm">
        {
          "Feedback boards are way to organize your feedbacks into pre-defined categories like “Feature Requests”, “Bugs”, “Integrations” and similar categories."
        }
      </p>

      <AddFeedbackBoard />

      <FeedbackBoardTable />
    </main>
  );
};

export default BoardsPage;
