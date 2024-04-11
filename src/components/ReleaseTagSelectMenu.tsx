import { Props, ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import React, { useState } from "react";
import { classNames } from "@/lib/utils";
import { IReleaseTag, ReleaseTagsOption } from "@/types";
import { useReleaseTagContext } from "@/app/context/ReleaseTagContext";
import { getReleaseTagCode } from "@/Utils";


const ReleaseTagSelectMenu: React.FC<Props> = (props) => {
  const { map: releaseTagMap, list: releaseTagIds, createReleaseTag } = useReleaseTagContext();

  const [isLoading, setIsLoading] = useState(false);

  const releaseTagsOptions: readonly ReleaseTagsOption[] = releaseTagIds.map(id => ({
    value: releaseTagMap[id]?.code!,
    label: releaseTagMap[id]?.name!,
  }));

  const onCreate = (tagName: string) => {
    const newReleaseTag: IReleaseTag = {
      name: tagName,
      code: getReleaseTagCode(tagName)
    };
    createReleaseTag(newReleaseTag, setIsLoading, false);

    const newReleaseTagOption: ReleaseTagsOption = {
      value: newReleaseTag.code!,
      label: newReleaseTag.name,
    };

    const actionMeta: ActionMeta<{ value: string, label: string; }> = {
      action: "select-option",
      option: newReleaseTagOption,
    };

    if (props.isMulti) {
      const newValues = props.value as ReleaseTagsOption[];
      props.onChange?.([...newValues, newReleaseTagOption], actionMeta);
    } else {
      props.onChange?.(newReleaseTagOption, actionMeta);
    }
  };

  return (
    <CreatableSelect
      {...props}
      className={classNames(
        "release-tag-select-menu",
        props.className || ""
      )}
      classNamePrefix={classNames(
        "release-tag-select-menu-prefix",
        props.classNamePrefix || ""
      )}
      options={releaseTagsOptions}
      isLoading={isLoading || props.isLoading}
      isDisabled={isLoading || props.isDisabled}
      onCreateOption={onCreate}
    />
  );
};

export default ReleaseTagSelectMenu;
