import { useReleaseCategoryContext } from "@/app/context/ReleaseCategoryContext";
import AlertModal from "@/components/AlertModal";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { IReleaseCategory } from "@/interfaces";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

const ReleaseCategoriesTable: React.FC<{}> = () => {
  const prevStates = useRef({ isLoading: false });
  const [categoryNames, setCategoryNames] = useState<{ [key: number]: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  const {
    map: releaseCategoryMap,
    list,
    deleteReleaseCategory,
    updateReleaseCategory,
  } = useReleaseCategoryContext();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReleaseCategoryId, setSelectedReleaseCategoryId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = (id: number) => {
    setSelectedReleaseCategoryId(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (id: number) => {
    setSelectedReleaseCategoryId(id);
    setCategoryNames((prev) => ({
      ...prev,
      [id]: releaseCategoryMap[id]?.name || "",
    }));
  };

  const onSaveReleaseCategory = async () => {
    if (!selectedReleaseCategoryId || !categoryNames[selectedReleaseCategoryId]) return;

    const releaseCategory: IReleaseCategory = {
      id: selectedReleaseCategoryId,
      name: categoryNames[selectedReleaseCategoryId],
    };

    await updateReleaseCategory(releaseCategory, setIsSaving);
    setSelectedReleaseCategoryId(null);
  };

  useEffect(() => {
    if (
      !selectedReleaseCategoryId ||
      (prevStates.current?.isLoading && !isLoading)
    ) {
      setSelectedReleaseCategoryId(null);
      setShowDeleteModal(false);
    }

    return () => {
      prevStates.current = { isLoading };
    };
  }, [isLoading]);

  const selectedReleaseCategory =
    selectedReleaseCategoryId !== null ? releaseCategoryMap[selectedReleaseCategoryId] : null;

  return (
    <div className="h-full relative overflow-y-auto mt-8">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="text-xs text-gray-700 bg-gray-50">
            <th className="px-6 py-3 w-full" scope="col">
              Category Name
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
                No categories found.
              </td>
            </tr>
          )}
          {list.map((releaseCategoryId) => {
            const isReleaseEdit = selectedReleaseCategoryId === releaseCategoryId;
            const releaseCategory = releaseCategoryMap[releaseCategoryId];
            if (!releaseCategory) return null;
            return (
              <tr
                key={releaseCategory.id}
                className="odd:bg-white even:bg-gray-50 border-b"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {!isReleaseEdit ? (
                    releaseCategory.name
                  ) : (
                    <Input
                      placeholder="Enter category name"
                      id="editCategoryName"
                      value={categoryNames[releaseCategoryId] || ""}
                      onChange={(e) =>
                        setCategoryNames({
                          ...categoryNames,
                          [releaseCategoryId]: e.target.value,
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
                          handleEdit(releaseCategory.id!);
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        href="#"
                        className="ml-2 font-medium text-red-600 hover:underline"
                        onClick={(e) => {
                          e.preventDefault();
                          onDelete(releaseCategory.id!);
                        }}
                      >
                        Delete
                      </Link>
                    </>
                  ) : (
                    <Button
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                      onClick={onSaveReleaseCategory}
                      disabled={isSaving}
                       id="savecategory"
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
        message={`Are you sure you want to delete the category "${selectedReleaseCategory?.name}"? This will permanently remove the category and its associations from all past changelogs.`}
        okBtnClassName="bg-red-600 hover:bg-red-800"
        spinClassName="!fill-red-600"
        onClickOk={() => deleteReleaseCategory(selectedReleaseCategoryId!, setIsLoading)}
        onClickCancel={() => {
          setShowDeleteModal(false)
          setSelectedReleaseCategoryId(null)
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default ReleaseCategoriesTable;
