import { useReleaseCategoryContext } from "@/app/context/ReleaseCategoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IReleaseCategory } from "@/interfaces";
import React, { useEffect, useRef, useState } from "react";
import { SketchPicker } from "react-color";

type AddReleaseCategoryProps = {
  selectedReleaseCategoryId: number | null;
  setSelectedReleaseCategoryId: (id: number | null) => void;
};

const AddReleaseCategory: React.FC<AddReleaseCategoryProps> = ({
  selectedReleaseCategoryId = null,
  setSelectedReleaseCategoryId,
}) => {
  const prevState = useRef({ isSaving: false });

  const [categoryName, setCategoryName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    error,
    map: releaseCategoryMap,
    createReleaseCategory,
  } = useReleaseCategoryContext();

  const onSaveReleaseCategory = () => {
    if (!categoryName) return;

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
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <Button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={onSaveReleaseCategory}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
};

export default AddReleaseCategory;
