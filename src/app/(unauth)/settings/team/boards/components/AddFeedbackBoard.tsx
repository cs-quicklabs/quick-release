import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { IFeedbackBoard } from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";

const AddFeedbackBoard = () => {
  const prevState = useRef({ isSaving: false });
  const { activeProjectId } = useProjectContext();

  const [boardName, setBoardName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showError, setShowError] = useState("");

  const { error, createFeedbackBoard } = useFeedbackBoardContext();

  const onSaveFeedbackBoard = () => {
    if (!boardName.trim()) {
      setShowError("Board name is required");
      return;
    }

    setShowError("");

    const feedbackBoard: IFeedbackBoard = {
      name: boardName,
      projectsId: activeProjectId!,
    };
    createFeedbackBoard(feedbackBoard, setIsSaving);
  };

  const resetForm = () => {
    setBoardName("");
  };

  useEffect(() => {
    if (prevState.current.isSaving && !isSaving) {
      if (!error) {
        resetForm();
      }
    }

    prevState.current = {
      isSaving,
    };
  }, [isSaving]);

  return (
    <div className="w-full mt-6">
      <div className="mb-5 mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {"Add new board"}
        </label>

        <Input
          placeholder="Board name"
          id="boardName"
          value={boardName}
          onChange={(e) => {
            if (!e.target.value) setShowError("Board name is required");
            else if(e.target.value.length > 30) setShowError("Board name must be less than 30 characters");
            else setShowError("");
            setBoardName(e.target.value);
          }}
          disabled={isSaving}
        />

        <span id="errorBoard" className="text-red-500 text-xs font-medium">{showError}</span>
      </div>

      <Button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={onSaveFeedbackBoard}
        disabled={isSaving || showError !== ""}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default AddFeedbackBoard;
