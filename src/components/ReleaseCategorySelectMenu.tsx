import { Props, ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import React, { useState } from "react";
import { classNames } from "@/lib/utils";
import { IReleaseCategory, ReleaseCategoriesOption } from "@/interfaces";
import { useReleaseCategoryContext } from "@/app/context/ReleaseCategoryContext";
import { getReleaseKeyCode } from "@/Utils";


const ReleaseCategorySelectMenu: React.FC<Props> = (props) => {
  const { map: releaseCategoryMap, list: releaseCategoryIds, createReleaseCategory } = useReleaseCategoryContext();

  const [isLoading, setIsLoading] = useState(false);

  const releaseCategoriesOptions: readonly ReleaseCategoriesOption[] = releaseCategoryIds.map(id => ({
    value: releaseCategoryMap[id]?.code!,
    label: releaseCategoryMap[id]?.name!,
  }));

  const onCreate = (tagName: string) => {
    const newReleaseCategory: IReleaseCategory = {
      name: tagName,
      code: getReleaseKeyCode(tagName)
    };
    createReleaseCategory(newReleaseCategory, setIsLoading, false);

    const newReleaseCategoryOption: ReleaseCategoriesOption = {
      value: newReleaseCategory.code!,
      label: newReleaseCategory.name!,
    };

    const actionMeta: ActionMeta<{ value: string, label: string; }> = {
      action: "select-option",
      option: newReleaseCategoryOption,
    };

    if (props.isMulti) {
      const newValues = props.value as ReleaseCategoriesOption[];
      props.onChange?.([...newValues, newReleaseCategoryOption], actionMeta);
    } else {
      props.onChange?.(newReleaseCategoryOption, actionMeta);
    }
  };

  return (
    <CreatableSelect
      {...props}
      className={classNames(
        "release-category-select-menu",
        props.className || ""
      )}
      classNamePrefix={classNames(
        "release-category-select-menu-prefix",
        props.classNamePrefix || ""
      )}
      options={releaseCategoriesOptions}
      isLoading={isLoading || props.isLoading}
      isDisabled={isLoading || props.isDisabled}
      onCreateOption={onCreate}
    />
  );
};

export default ReleaseCategorySelectMenu;
