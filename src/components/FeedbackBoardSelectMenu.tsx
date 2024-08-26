import { Props, ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { classNames } from "@/lib/utils";
import { IFeedbackBoard, FeedbackBoardsOption } from "@/interfaces";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { useProjectContext } from "@/app/context/ProjectContext";

const FeedbackBoardselectMenu: React.FC<Props> = (props) => {
  const {
    map: feedbackBoardMap,
    list: feedbackBoardIds,
    createFeedbackBoard,
  } = useFeedbackBoardContext();
  const { activeProjectId } = useProjectContext();

  const [isLoading, setIsLoading] = useState(false);

  const feedbackBoardsOptions: readonly FeedbackBoardsOption[] = useMemo(
    () =>
      feedbackBoardIds.map((id) => ({
        value: id!,
        label: feedbackBoardMap[id]?.name!,
      })),
    [feedbackBoardMap, feedbackBoardIds]
  );

  const onCreate = async (boardName: string) => {
    const newFeedbackBoard: IFeedbackBoard = {
      name: boardName,
      projectsId: activeProjectId!,
    };
    await createFeedbackBoard(newFeedbackBoard, setIsLoading, false);
    // if feedback board created successfully
    const newFeedbackBoardId = feedbackBoardIds.find((id) => feedbackBoardMap[id]?.name === boardName);
    
    if(!newFeedbackBoardId){
      return;
    }


    const newFeedbackBoardOption: FeedbackBoardsOption = {
      value: feedbackBoardIds[feedbackBoardIds.length - 1]!,
      label: newFeedbackBoard.name!,
    };

    const actionMeta: ActionMeta<{ value: string; label: string }> = {
      action: "select-option",
      option: newFeedbackBoardOption,
    };
    props.onChange?.(newFeedbackBoardOption, actionMeta);
  };

  return (
    <CreatableSelect
      {...props}
      className={classNames("release-tag-select-menu", props.className || "")}
      classNamePrefix={classNames(
        "release-tag-select-menu-prefix",
        props.classNamePrefix || ""
      )}
      options={feedbackBoardsOptions}
      value={props.value}
      isLoading={isLoading || props.isLoading}
      isDisabled={isLoading || props.isDisabled}
      onCreateOption={onCreate}
      onChange={props.onChange}
    />
  );
};

export default FeedbackBoardselectMenu;
