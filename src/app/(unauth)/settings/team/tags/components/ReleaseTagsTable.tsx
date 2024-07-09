import { useReleaseTagContext } from "@/app/context/ReleaseTagContext";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IReleaseTag } from "@/interfaces";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type ReleaseTagsTableProps = {
  onEdit: (id: number) => void;
};

const ReleaseTagsTable: React.FC<ReleaseTagsTableProps> = ({ onEdit }) => {
  const prevStates = useRef({ isLoading: false });
  const [tagNames, setTagNames] = useState<{ [key: number]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const {
    map: releaseTagMap,
    list,
    deleteReleaseTag,
    updateReleaseTag,
  } = useReleaseTagContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReleaseTagId, setSelectedReleaseTagId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = (id: number) => {
    setSelectedReleaseTagId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedReleaseTagId(id);
    setTagNames((prev) => ({
      ...prev,
      [id]: releaseTagMap[id]?.name || "",
    }));
  };

  const onSaveReleaseTag = async () => {
    if (!selectedReleaseTagId || !tagNames[selectedReleaseTagId]) return;

    const releaseTag: IReleaseTag = {
      id: selectedReleaseTagId,
      name: tagNames[selectedReleaseTagId],
    };

    await updateReleaseTag(releaseTag, setIsSaving);
    setSelectedReleaseTagId(null);
  };

  useEffect(() => {
    if (
      !selectedReleaseTagId ||
      (prevStates.current?.isLoading && !isLoading)
    ) {
      setSelectedReleaseTagId(null);
      setShowDeleteModal(false);
    }

    return () => {
      prevStates.current = { isLoading };
    };
  }, [isLoading]);

  const selectedReleaseTag =
    selectedReleaseTagId !== null ? releaseTagMap[selectedReleaseTagId] : null;

  return (
    <div className="h-full relative overflow-y-auto mt-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-xs text-gray-700 bg-gray-50">
            <th className="px-6 py-3 w-full" scope="col">
              Tag Name
            </th>
            <th className="px-6 py-3" scope="col">
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
                No tags found.
              </td>
            </tr>
          )}
          {list.map((releaseTagId) => {
            const isReleaseEdit = selectedReleaseTagId === releaseTagId;
            const releaseTag = releaseTagMap[releaseTagId];
            if (!releaseTag) return null;
            return (
              <tr
                key={releaseTag.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isReleaseEdit ? (
                    releaseTag.name
                  ) : (
                    <Input
                      placeholder="Enter tag name"
                      value={tagNames[releaseTagId] || ""}
                      onChange={(e) =>
                        setTagNames({
                          ...tagNames,
                          [releaseTagId]: e.target.value,
                        })
                      }
                      disabled={isSaving}
                    />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isReleaseEdit ? (
                    <>
                      <Link
                        href="#"
                        className="font-medium text-blue-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(releaseTag.id!);
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        href="#"
                        className="ml-2 font-medium text-red-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(releaseTag.id!);
                        }}
                      >
                        Delete
                      </Link>
                    </>
                  ) : (
                    <Button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      onClick={onSaveReleaseTag}
                      disabled={isSaving}
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
        message={`Are you sure you want to delete the tag "${selectedReleaseTag?.name}"? This will permanently remove the tag and its associations from all past changelogs.`}
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => deleteReleaseTag(selectedReleaseTagId!, setIsLoading)}
        onClickCancel={() => setShowDeleteModal(false)}
        loading={isLoading}
      />
    </div>
  );
};

export default ReleaseTagsTable;
