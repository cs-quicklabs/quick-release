import { Props, ActionMeta } from "react-select";
import CreatableSelect from "react-select/creatable";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { classNames } from "@/lib/utils";
import { IFeedbackBoard, FeedbackBoardsOption } from "@/interfaces";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { requestHandler, showNotification } from "@/Utils";
import { createFeedbackBoardRequest } from "@/fetchHandlers/feedbacks";

const FeedbackBoardselectMenu: React.FC<Props> = (props) => {
  const {
    map: feedbackBoardMap,
    list: feedbackBoardIds,
    setList,
    setMap,
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
    await requestHandler(
      () => createFeedbackBoardRequest(newFeedbackBoard),
      setIsLoading,
      (res) => {
        const { data } = res;
        const feedbackBoardId: string = data.id!;
        setMap({ ...feedbackBoardMap, [feedbackBoardId]: data });
        const newFeedbackBoardIds = [...feedbackBoardIds, feedbackBoardId];
        setList(newFeedbackBoardIds);
        const newFeedbackBoardOption: FeedbackBoardsOption = {
          value: data.id,
          label: data.name,
        };

        const actionMeta: ActionMeta<{ value: string; label: string }> = {
          action: "select-option",
          option: newFeedbackBoardOption,
        };
        console.log("actionMeta", actionMeta);
        props.onChange?.(newFeedbackBoardOption, actionMeta);
      },
      (error) => showNotification("error", error)
    );
  
  };

  return (
    <CreatableSelect
      {...props}
      className={classNames(
        "feedback-board-select-menu",
        props.className || ""
      )}
      classNamePrefix={classNames(
        "feedback-board-select-menu-prefix",
        props.classNamePrefix || ""
      )}
      options={feedbackBoardsOptions}
      isLoading={isLoading || props.isLoading}
      isDisabled={isLoading || props.isDisabled}
      onCreateOption={onCreate}
    />
  );
};

export default FeedbackBoardselectMenu;
