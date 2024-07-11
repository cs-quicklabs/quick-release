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
  const [textColor, setTextColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#000000");
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBgColorPicker, setShowBgColorPicker] = useState(false);

  const textColorPickerRef = useRef<HTMLDivElement>(null);
  const bgColorPickerRef = useRef<HTMLDivElement>(null);

  const {
    error,
    map: releaseCategoryMap,
    createReleaseCategory,
  } = useReleaseCategoryContext();

  const onSaveReleaseCategory = () => {
    if (!categoryName) return;

    const releaseCategory: IReleaseCategory = {
      name: categoryName,
      textColor,
      bgColor,
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        textColorPickerRef.current &&
        !textColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowTextColorPicker(false);
      }
      if (
        bgColorPickerRef.current &&
        !bgColorPickerRef.current.contains(event.target as Node)
      ) {
        setShowBgColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

        <div>
          <div className="mt-6 flex justify-between items-center">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Text Color
              </label>
              <div className="flex items-center gap-2" onClick={() => setShowTextColorPicker(!showTextColorPicker)}>
                <div
                  className={`bg-${textColor} w-10 h-10 rounded-md cursor-pointer`}
                  style={{ backgroundColor: textColor }}
                ></div>
                <Input
                  placeholder="Enter text color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}

                  disabled={true}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                Background Color
              </label>
              <div className="flex items-center gap-2" onClick={() => setShowBgColorPicker(!showBgColorPicker)}>
                <div
                  className={`bg-${textColor} w-10 h-10 rounded-md cursor-pointer`}
                  style={{ backgroundColor: bgColor }}
                  
                ></div>
                <Input
                  placeholder="Enter background color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="relative mt-4">
            {showTextColorPicker && (
              <div ref={textColorPickerRef} className="absolute z-10">
                <SketchPicker
                  color={textColor}
                  onChange={(color) => setTextColor(color.hex)}
                />
              </div>
            )}
            {showBgColorPicker && (
              <div ref={bgColorPickerRef} className="absolute right-0 z-10">
                <SketchPicker
                
                  color={bgColor}
                  onChange={(color) => setBgColor(color.hex)}
                />
              </div>
            )}
          </div>
        </div>
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
