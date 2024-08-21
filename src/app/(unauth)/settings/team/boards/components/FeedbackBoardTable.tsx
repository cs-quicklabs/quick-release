import AlertModal from "@/components/AlertModal";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { IFeedbackBoard } from "@/interfaces";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { useUserContext } from "@/app/context/UserContext";
import { showNotification } from "@/Utils";
import { useProjectContext } from "@/app/context/ProjectContext";

const FeedbackBoardTable: React.FC<{}> = () => {
  const prevStates = useRef({ isLoading: false });
  const [boardNames, setBoardNames] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const { activeProjectId } = useProjectContext();
  const [showNoActionModal, setShowNoActionModal] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState("");
  const {
    map: feedbackBoardMap,
    list,
    deleteFeedbackBoard,
    updateFeedbackBoard,
  } = useFeedbackBoardContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFeedbackBoardId, setSelectedFeedbackBoardId] = useState<
    string | null
  >(null);
  const [selectedDeletedFeedbackBoardId, setSelectedDeletedFeedbackBoardId] =
    useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const boardList = useMemo(() => {
    setSelectedFeedbackBoardId(null);
    return list
  }, [list]);

  const onDelete = (id: string) => {
    setSelectedDeletedFeedbackBoardId(id);
    const feedbackBoard = feedbackBoardMap[id];
    if (feedbackBoard?.isDefault) {
      setShowNoActionModal(true);
    } else {
      setShowDeleteModal(true);
    }
  };

  const handleEdit = (id: string) => {
    setSelectedFeedbackBoardId(id);
    setBoardNames((prev) => ({
      ...prev,
      [id]: feedbackBoardMap[id]?.name || "",
    }));
  };

  const onSaveFeedbackBoard = async () => {
    if (!selectedFeedbackBoardId || !boardNames[selectedFeedbackBoardId]) {
      return;
    }

    const feedbackBoard: IFeedbackBoard = {
      id: selectedFeedbackBoardId,
      name: boardNames[selectedFeedbackBoardId],
      projectsId: activeProjectId!,
    };

    await updateFeedbackBoard(feedbackBoard, setIsSaving);
    setSelectedFeedbackBoardId(null);
  };

  useEffect(() => {
    if (
      !selectedFeedbackBoardId ||
      (prevStates.current?.isLoading && !isLoading)
    ) {
      setSelectedFeedbackBoardId(null);
      setShowDeleteModal(false);
    }

    return () => {
      prevStates.current = { isLoading };
    };
  }, [isLoading]);

  return (
    <div className="h-full relative overflow-y-auto mt-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-xs text-gray-700 bg-gray-50">
            <th className="px-6 py-3 w-full" scope="col">
              Board Name
            </th>
            <th className="px-6 py-3 text-center" scope="col"></th>
            <th className="px-6 py-3 text-center" scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {!boardList.length && (
            <tr className="text-sm text-gray-500 bg-white">
              <td
                className="px-6 py-4 whitespace-nowrap text-center"
                colSpan={2}
              >
                No feedback boards found.
              </td>
            </tr>
          )}
          {boardList.map((feedbackBoardId) => {
            const isBoardEdit = selectedFeedbackBoardId === feedbackBoardId;
            const feedbackBoard = feedbackBoardMap[feedbackBoardId];
            if (!feedbackBoard) return null;
            return (
              <tr
                key={feedbackBoard.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isBoardEdit ? (
                    feedbackBoard.name
                  ) : (
                    <>
                      <Input
                        placeholder="Enter board name"
                        id="editBoardName"
                        value={boardNames[feedbackBoardId] || ""}
                        onChange={(e) => {
                          if (!e.target.value) setShowErrorMessage("Board name is required");
                          else if(e.target.value.length > 30) setShowErrorMessage("Board name must be less than 30 characters");
                          else setShowErrorMessage("");
                          setBoardNames({
                            ...boardNames,
                            [feedbackBoardId]: e.target.value,
                          })
                        }}
                        disabled={isSaving}
                      />
                      <span className="text-xs font-medium text-red-500">
                        {showErrorMessage}
                      </span>
                    </>
                  )}
                </td>
                <td>
                  {feedbackBoard.isDefault && !isBoardEdit && (
                    <span className="font-medium text-green-600 bg-green-200 px-2 rounded">
                      Default
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-start">
                  {!isBoardEdit ? (
                    <div className="flex gap-2 justify-end">
                      <Link
                        href="#"
                        id="editboard"
                        className="font-medium text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(feedbackBoard.id!);
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        href="#"
                        id="deleteboard"
                        className="ml-2 font-medium text-red-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(feedbackBoard.id!);
                        }}
                      >
                        Delete
                      </Link>
                    </div>
                  ) : (
                    <Button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      onClick={onSaveFeedbackBoard}
                      disabled={isSaving || showErrorMessage !== ""}
                      id="saveboard"
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AlertModal
        show={showDeleteModal}
        title={`Delete Board “${
          feedbackBoardMap[selectedDeletedFeedbackBoardId!]?.name
        }”?`}
        message={`A board when deleted, will not be visible to public and they can not add feedback in this board.`}
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() =>
          deleteFeedbackBoard(selectedDeletedFeedbackBoardId!, activeProjectId!, setIsLoading)
        }
        onClickCancel={() => {
          setShowDeleteModal(false);
          setSelectedFeedbackBoardId(null);
        }}
        okBtnText="Delete"
        cancelBtnText="Cancel"
        loading={isLoading}
      />
      <AlertModal
        show={showNoActionModal}
        title={`Could not delete board!`}
        message={`Default boards can not be deleted as they are created when a team is created and a team will always have one default board.`}
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => {
          setShowNoActionModal(false);
          setSelectedDeletedFeedbackBoardId(null);
        }}
        onClickCancel={() => {
          setShowNoActionModal(false);
          setSelectedDeletedFeedbackBoardId(null);
        }}
        okBtnText="ok"
        isCancelBtnHidden={true}
        loading={isLoading}
      />
    </div>
  );
};

export default FeedbackBoardTable;
