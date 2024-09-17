import { useReleaseCategoryContext } from "@/app/context/ReleaseCategoryContext";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { IReleaseCategory } from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";

type AddReleaseCategoryProps = {
  selectedReleaseCategoryId: number | null;
  setSelectedReleaseCategoryId: (id: number | null) => void;
};

const AddReleaseCategory: React.FC<AddReleaseCategoryProps> = ({
  selectedReleaseCategoryId = null,
  setSelectedReleaseCategoryId,
}) => {
  const prevState = useRef({ isSaving: false });
  const [showError, setShowError] = useState<string>("");

  const [categoryName, setCategoryName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const { error, createReleaseCategory, map: releaseCategoryMap } = useReleaseCategoryContext();

  const onSaveReleaseCategory = () => {
    if (!categoryName.trim()) {
      setShowError("Category name is required");
      return;
    }

    setShowError("");
    const releaseCategory: IReleaseCategory = {
      name: categoryName,
    };

    createReleaseCategory(releaseCategory, setIsSaving);
  };

  const resetForm = () => {
    setSelectedReleaseCategoryId(null);
    setCategoryName("");
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

  useEffect(() => {
    if (selectedReleaseCategoryId !== null) {
      const releaseCategory = releaseCategoryMap[selectedReleaseCategoryId];
      setCategoryName(releaseCategory?.name!);
    }
  }, [selectedReleaseCategoryId]);

  return (
    <div className="w-full mt-6">
      <div className="mb-5 mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-900">
          Add new category
        </label>

        <Input
          placeholder="Enter category name"
          id="categoryName"
          value={categoryName}
          onChange={(e) => {
            if (!e.target.value) setShowError("Category name is required");
            else if (e.target.value.length > 30)
              setShowError("Category name must be less than 30 characters");
            else setShowError("");
            setCategoryName(e.target.value);
          }}
          disabled={isSaving}
        />

        <span className="text-red-500 text-xs font-medium">{showError}</span>
      </div>

      <Button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={onSaveReleaseCategory}
        disabled={isSaving || showError !== ""}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default AddReleaseCategory;
