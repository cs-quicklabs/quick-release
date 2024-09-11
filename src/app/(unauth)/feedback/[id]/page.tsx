"use client";

import {
  checkRichTextEditorIsEmpty,
  extractImageUrls,
  requestHandler,
} from "@/Utils";
import { useFeedbackPostContext } from "@/app/context/FeedbackPostContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import NotFound from "@/app/not-found";
import ScreenLoader from "@/atoms/ScreenLoader";
import { Button } from "@/atoms/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/atoms/card";
import { Form } from "@/atoms/form";
import BaseTemplate from "@/templates/BaseTemplate";
import { FeedbackPostForm, FeedbackPostType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { fileDeleteRequest } from "@/fetchHandlers/file";
import { FeedbackStatus, FeedbackVisibilityStatus } from "@/Utils/constants";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import moment from "moment";
import { DropDownOptionType, IReleaseTag } from "@/interfaces";
import FeedbackForm from "./components/FeedbackForm";

const AddFeedbackPost = ({ params }: { params: { id: string } }) => {
  const prevProps = useRef({
    isSaving: false,
    loading: false,
  });

  const router = useRouter();
  const {
    list: feedbackBoardList,
    map: feedbackBoardMap,
    getAllFeedbackBoards,
  } = useFeedbackBoardContext();
  const {
    error,
    createFeedbackPost,
    updateFeedbackPost,
    getFeedbackPost,
    isLoading: fetchFeedbackPostLoading,
    map: feedbackPostMap,
  } = useFeedbackPostContext();
  const [isSaving, setIsSaving] = useState(false);
  const [loader, setLoader] = useState(false);
  const { activeProjectId, getActiveProject } = useProjectContext();
  const fetchActiveProject = useCallback(async () => {
    if (!activeProjectId) {
      await getActiveProject(setLoader);
    }
  }, [activeProjectId]);

  const fetchAllFeedbackBoards = useCallback(async () => {
    if (activeProjectId) {
      const query = { projectsId: activeProjectId };
      await getAllFeedbackBoards(query, setLoader);
    }
  }, [params.id, activeProjectId]);

  const fetchFeedbackPost = useCallback(async () => {
    if (activeProjectId && params.id !== "add") {
      const query = { projectsId: activeProjectId };
      await getFeedbackPost(params.id, query);
    }
  }, [params.id, activeProjectId]);

  useEffect(() => {
    fetchActiveProject();
  }, [activeProjectId]);

  useEffect(() => {
    fetchAllFeedbackBoards();
    fetchFeedbackPost();
  }, [params.id, activeProjectId]);

  const feedbackpost = useMemo(() => {
    return feedbackPostMap[params.id] || null;
  }, [feedbackPostMap[params.id]]);

  const defaultFeedbackBoard = useMemo(() => {
    if (feedbackBoardList && feedbackBoardList.length > 0) {
      const boardId = feedbackBoardList.find(
        (boardId) => feedbackBoardMap[boardId]?.isDefault === true
      );
      return {
        value: boardId,
        label: feedbackBoardMap[boardId!]?.name,
      };
    }
    return null;
  }, [feedbackBoardList, feedbackBoardMap]);

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Title can not be more than 50 characters",
    }),
    description: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .refine(checkRichTextEditorIsEmpty, { message: "Required" }),
    status: z.object({
      value: z.string().trim().min(1, { message: "Required" }),
      label: z.string().trim().min(1, { message: "Required" }),
    }),
    feedbackBoard: z.object({
      value: z.string().trim().min(1, { message: "Required" }),
      label: z.string().trim().min(1, { message: "Required" }),
    }),
    visibilityStatus: z
      .object({
        value: z.string().trim().min(1, { message: "Required" }),
        label: z.string().trim().min(1, { message: "Required" }),
      })
      .optional(),
    releaseETA: z.date().optional(),
    releaseTags: z
      .array(
        z.object({
          value: z.string(),
          label: z.string(),
        })
      )
      .optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: {
        value: FeedbackStatus["IN_REVIEW"].id,
        label: FeedbackStatus["IN_REVIEW"].title,
      },
      feedbackBoard: {
        value: defaultFeedbackBoard?.value,
        label: defaultFeedbackBoard?.label,
      },
    },
  });

  const formValues = form.getValues();

  useEffect(() => {
    const setDefaultValues = () => {
      if (feedbackpost) {
        const selectedReleaseTags = feedbackpost.releaseTags as IReleaseTag[];

        form.reset({
          title: feedbackpost.title,
          description: feedbackpost.description,
          status: {
            value: FeedbackStatus[feedbackpost.status].id,
            label: FeedbackStatus[feedbackpost.status].title,
          },
          feedbackBoard: {
            value: feedbackpost.feedbackBoards?.cuid,
            label: feedbackpost.feedbackBoards?.name,
          },
          releaseTags: selectedReleaseTags
            ? selectedReleaseTags.map((tag) => ({
                value: tag.code,
                label: tag.name,
              }))
            : [],
          releaseETA: feedbackpost.releaseETA
            ? moment(feedbackpost.releaseETA).toDate()
            : undefined,
          visibilityStatus: {
            value: FeedbackVisibilityStatus[feedbackpost.visibilityStatus!].id,
            label:
              FeedbackVisibilityStatus[feedbackpost.visibilityStatus!].title,
          },
        });
      }
    };
    setDefaultValues();
  }, [feedbackpost]);

  const removeFiles = (filePathUrls: string[]) => {
    return new Promise(async (resolve, reject) => {
      await requestHandler(
        async () => await fileDeleteRequest(filePathUrls, "Feedbacks"),
        null,
        (res: any) => {
          resolve(filePathUrls);
        },
        (errMessage) => {
          reject(errMessage);
        }
      );
    });
  };

  const handleCreatePost: SubmitHandler<FeedbackPostForm> = async (data) => {
    const feedbackPostData: FeedbackPostType = {
      title: data.title,
      description: data.description,
      status: FeedbackStatus[data.status.value!].id,
      feedbackBoardsId: data.feedbackBoard.value!,
      projectsId: activeProjectId!,
    };

    if (params.id !== "add") {
      feedbackPostData.releaseETA = data.releaseETA;
      feedbackPostData.releaseTags = data.releaseTags?.map((tag) => tag.value);
      feedbackPostData.visibilityStatus =
        FeedbackVisibilityStatus[data.visibilityStatus?.value!]?.id;
      feedbackPostData.id = params.id;

      updateFeedbackPost(feedbackPostData, setIsSaving);
      return;
    }

    createFeedbackPost(feedbackPostData, setIsSaving);
  };

  useEffect(() => {
    if (prevProps?.current?.isSaving && !isSaving) {
      if (!error) {
        router.back();
      }
    }

    if (prevProps?.current?.loading && !fetchFeedbackPostLoading) {
      if (error) {
        router.back();
      }
    }

    return () => {
      prevProps.current = {
        isSaving,
        loading: fetchFeedbackPostLoading,
      };
    };
  }, [isSaving, fetchFeedbackPostLoading]);

  if (
    !feedbackpost &&
    params.id !== "add" &&
    fetchFeedbackPostLoading &&
    loader
  ) {
    return <ScreenLoader />;
  }

  if (!feedbackpost && params.id !== "add" && !fetchFeedbackPostLoading) {
    return (
      <BaseTemplate>
        <NotFound />
      </BaseTemplate>
    );
  }

  const handleCancelButton = async () => {
    const imageUrls = extractImageUrls(formValues?.description);
    if (params.id === "add" && imageUrls.length > 0) {
      await removeFiles(imageUrls);
    }
    router.back();
  };

  return (
    <BaseTemplate>
      <>
        <div className="mx-auto max-w-5xl px-4 lg:px-0 pt-10 pb-12 lg:pb-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePost)}>
              <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-lg font-medium leading-6 text-gray-900">
                  {params.id === "add" ? "Create Feedback" : "Edit Feedback"}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-gray-500">
                  {`Let’s get started by filling in the information below to ${
                    params.id === "add" ? "create" : "update"
                  } your feedback`}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 px-0">
                <FeedbackForm
                  form={form}
                  defaultFeedbackBoardOption={
                    defaultFeedbackBoard as DropDownOptionType
                  }
                  id={params.id}
                />
              </CardContent>
              <CardFooter className="justify-end px-0">
                <Button
                  id="cancel-btn"
                  className="mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
                  type="button"
                  onClick={handleCancelButton}
                >
                  {"Cancel"}
                </Button>
                <Button
                  id="submit-btn"
                  type="submit"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white"
                  disabled={isSaving}
                >
                  {isSaving ? "Submitting..." : "Submit Feedback"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </>
    </BaseTemplate>
  );
};

export default AddFeedbackPost;
