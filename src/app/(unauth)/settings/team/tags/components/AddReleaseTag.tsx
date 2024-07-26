import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/atoms/button";
import { Input } from "@/atoms/input";
import { useReleaseTagContext } from "@/app/context/ReleaseTagContext";
import { IReleaseTag } from "@/interfaces";

type AddReleaseTagProps = {
  selectedReleaseTagId: number | null;
  setSelectedReleaseTagId: (id: number | null) => void;
};

const AddReleaseTag: React.FC<AddReleaseTagProps> = ({ selectedReleaseTagId = null, setSelectedReleaseTagId }) => {
  // const isEditingReleaseTag = selectedReleaseTagId !== null;

  const prevState = useRef({ isSaving: false });

  const [tagName, setTagName] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  const { error, map: releaseTagMap, createReleaseTag } = useReleaseTagContext();


  const onSaveReleaseTag = () => {
    if (!tagName) return;

    const releaseTag: IReleaseTag = {
      name: tagName,
    };

    createReleaseTag(releaseTag, setIsSaving);
  };

  const resetForm = () => {
    setSelectedReleaseTagId(null);
    setTagName("");
  };

  useEffect(() => {
    if (prevState.current.isSaving && !isSaving) {
      if (!error) {
        resetForm();
      }
    }

    return () => {
      prevState.current = {
        isSaving,
      };
    };
  }, [isSaving]);

  useEffect(() => {
    if (selectedReleaseTagId !== null) {
      const releaseTag = releaseTagMap[selectedReleaseTagId];
      setTagName(releaseTag?.name!);
    }
  }, [selectedReleaseTagId]);

  return (
    <div className="w-full mt-6">
      <div className="mb-5 mt-6">
        <label
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Add new tag
        </label>

        <Input
          placeholder="Enter tag name"
          id="tagname"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          disabled={isSaving}
        />
      </div>

      <Button
      
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        onClick={onSaveReleaseTag}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>

      {/* {
        isEditingReleaseTag &&
        <Button
          className="text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center ml-4"
          onClick={resetForm}
          disabled={isSaving}
        >
          Cancel
        </Button>
      } */}
    </div>
  );
};

export default AddReleaseTag;
