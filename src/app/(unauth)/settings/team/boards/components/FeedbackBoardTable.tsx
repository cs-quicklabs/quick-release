// import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { IFeedbackBoard } from "@/interfaces";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useFeedbackBoardContext } from "@/app/context/FeedbackContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useUserContext } from "@/app/context/UserContext";

const ReleaseCategoriesTable: React.FC<{}> = () => {
  const prevStates = useRef({ isLoading: false });
  const [boardNames, setBoardNames] = useState<{ [key: number]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const { loggedInUser } = useUserContext();
  const {
    map: feedbackBoardMap,
    list,
    deleteFeedbackBoard,
    updateFeedbackBoard,
  } = useFeedbackBoardContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFeedbackBoardId, setSelectedFeedbackBoardId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = (id: number) => {
    setSelectedFeedbackBoardId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedFeedbackBoardId(id);
    setBoardNames((prev) => ({
      ...prev,
      [id]: feedbackBoardMap[id]?.name || "",
    }));
  };

  const onSaveFeedbackBoard = async () => {
    if (!selectedFeedbackBoardId || !boardNames[selectedFeedbackBoardId])
      return;

    const feedbackBoard: IFeedbackBoard = {
      id: selectedFeedbackBoardId,
      name: boardNames[selectedFeedbackBoardId],
      projectsId: loggedInUser?.activeProjectId!,
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

  const selectedFeedbackBoard =
    selectedFeedbackBoardId !== null
      ? feedbackBoardMap[selectedFeedbackBoardId]
      : null;

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
          {!list.length && (
            <tr className="text-sm text-gray-500 bg-white">
              <td
                className="px-6 py-4 whitespace-nowrap text-center"
                colSpan={2}
              >
                No categories found.
              </td>
            </tr>
          )}
          {list.map((feedbackBoardId) => {
            const isReleaseEdit = selectedFeedbackBoardId === feedbackBoardId;
            const feedbackBoard = feedbackBoardMap[feedbackBoardId];
            if (!feedbackBoard) return null;
            return (
              <tr
                key={feedbackBoard.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isReleaseEdit ? (
                    feedbackBoard.name
                  ) : (
                    <Input
                      placeholder="Enter board name"
                      id="editBoardNamew"
                      value={boardNames[feedbackBoardId] || ""}
                      onChange={(e) =>
                        setBoardNames({
                          ...boardNames,
                          [feedbackBoardId]: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                  )}
                </td>
                <td>
                  {feedbackBoard.isDefault && !isReleaseEdit && (
                    <span className="font-medium text-green-600 bg-green-200 px-2 rounded">
                      Default
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isReleaseEdit ? (
                    <div className="flex gap-2 justify-end">
                      <Link
                        href="#"
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
                      disabled={isSaving}
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
        title="Delete change log"
        message={`Are you sure you want to delete the board "${selectedFeedbackBoard?.name}"?\n Remember that You can only delete boards that are not in use.`}
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() =>
          deleteFeedbackBoard(selectedFeedbackBoardId!, setIsLoading)
        }
        onClickCancel={() => {
          setShowDeleteModal(false)
          setSelectedFeedbackBoardId(null)
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default ReleaseCategoriesTable;
