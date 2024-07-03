import React, { useEffect, useRef, useState } from "react";
import { useReleaseTagContext } from "@/app/context/ReleaseTagContext";
import Link from "next/link";
import AlertModal from "@/components/AlertModal";

type ReleaseTagsTableProps = {
  onEdit: (id: number) => void;
};

const ReleaseTagsTable: React.FC<ReleaseTagsTableProps> = ({ onEdit }) => {
  const prevStates = useRef({ isLoading: false });

  const { map: releaseTagMap, list, deleteReleaseTag } = useReleaseTagContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReleaseTagId, setSelectedReleaseTagId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = (id: number) => {
    setSelectedReleaseTagId(id);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    if (!selectedReleaseTagId || (prevStates.current?.isLoading && !isLoading)) {
      setSelectedReleaseTagId(null);
      setShowDeleteModal(false);
    }

    return () => {
      prevStates.current = {
        isLoading
      };
    };
  }, [isLoading]);

  const selectedReleaseTag = typeof selectedReleaseTagId === null ? null : releaseTagMap[selectedReleaseTagId!];

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
          {
            !list.length &&
            <tr className="text-sm text-gray-500 bg-white">
              <td className="px-6 py-4 whitespace-nowrap text-center" colSpan={2}>
                No tags found.
              </td>
            </tr>
          }

          {
            list.map((releaseTagId) => {
              const releaseTag = releaseTagMap[releaseTagId];
              if (!releaseTag) return null;

              return (
                <tr key={releaseTag.id} className="odd:bg-white even:bg-gray-50 border-b">
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {releaseTag.name}
                  </td>

                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <Link
                      href="#"
                      className="font-medium text-blue-600 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        onEdit(releaseTag.id!);
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
                  </td>
                </tr>
              );
            })
          }
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
