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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/atoms/form";
import { Input } from "@/atoms/input";
import BaseTemplate from "@/templates/BaseTemplate";
import { FeedbackPostForm, FeedbackPostType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
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
import { FeedbackStatus } from "@/Utils/constants";
import { useFeedbackBoardContext } from "@/app/context/FeedbackBoardContext";
import Select from "react-select";
import FeedbackBoardselectMenu from "@/components/FeedbackBoardSelectMenu";

const RichTextEditor = dynamic(() => import("@/atoms/RichTextEditor"), {
  ssr: true,
});

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
    map: feedbackPostMap,
  } = useFeedbackPostContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchFeedbackPostLoading, setFetchFeedbackPostLoading] =
    useState(false);
  const { activeProjectId, getActiveProject } = useProjectContext();

  const fetchActiveProject = useCallback(async () => {
    if(!activeProjectId){
      await getActiveProject(setLoader);
    }
  }, [activeProjectId]);

  const fetchAllFeedbackBoards = useCallback(async () => {
    if(activeProjectId){
      const query = { projectsId: activeProjectId };
      await getAllFeedbackBoards(query, setLoader);
    }
  }, [params.id, activeProjectId]);

  useEffect(() => {
    fetchActiveProject();
  }, [activeProjectId]);

  useEffect(() => {
    fetchAllFeedbackBoards();
  }, [params.id, activeProjectId]);

  const feedbackpost = useMemo(() => {
    return feedbackPostMap[params.id] || null;
  }, [feedbackPostMap[params.id]]);

  const defaultFeedbackBoard = useMemo(() => {
    if (feedbackBoardList && feedbackBoardList.length > 0) {
      const boardId = feedbackBoardList.find(
        boardId => feedbackBoardMap[boardId]?.isDefault === true
      )
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      status: { value: FeedbackStatus["IN_REVIEW"].id, label: FeedbackStatus["IN_REVIEW"].title },
      feedbackBoard: { value: defaultFeedbackBoard?.value, label: defaultFeedbackBoard?.label },
    },
  });

  const formValues = form.getValues();

  useEffect(() => {
    if (!formValues.feedbackBoard.value) {
      form.reset({
        ...formValues,
        feedbackBoard: { value: defaultFeedbackBoard?.value, label: defaultFeedbackBoard?.label },
      });
    }
  }, [formValues]);

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
    const feedbackpostPost: FeedbackPostType = {
      title: data.title,
      description: data.description,
      status: FeedbackStatus[data.status.value]?.id,
      boardId: data.feedbackBoard.value!,
      projectsId: activeProjectId!,
    };

    createFeedbackPost(feedbackpostPost, setIsSaving);

  };

  useEffect(() => {
    if (prevProps?.current?.isSaving && !isSaving) {
      if (!error) {
        router.replace("/allPosts");
      }
    }

    if (prevProps?.current?.loading && !loading) {
      if (error) {
        router.replace("/allPosts");
      }
    }

    return () => {
      prevProps.current = {
        isSaving,
        loading,
      };
    };
  }, [isSaving, loading]);

  if (
    !feedbackpost &&
    loading &&
    params.id !== "add" &&
    fetchFeedbackPostLoading &&
    !isLoading &&
    loader
  ) {
    return <ScreenLoader />;
  }

  if (
    !feedbackpost &&
    params.id !== "add" &&
    !fetchFeedbackPostLoading &&
    !isLoading
  ) {
    return (
      <BaseTemplate>
        <NotFound />
      </BaseTemplate>
    );
  }

  const FeedbackStatusOptions = Object.keys(FeedbackStatus).map((key) => {
    return {
      value: FeedbackStatus[key].id,
      label: FeedbackStatus[key].title,
    };
  });

  const handleCancelButton = async () => {
    const imageUrls = extractImageUrls(formValues?.description);
    if (params.id === "add" && imageUrls.length > 0) {
      await removeFiles(imageUrls);
    }
    router.replace("/allLogs");
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{"Title"}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter feedback post title"
                            {...field}
                            id="title"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-between gap-12">
                  <FormField
                    control={form.control}
                    name="feedbackBoard"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>{"Feedback Board"}</FormLabel>
                        <FormControl>
                          <Controller
                            name="feedbackBoard"
                            control={form.control}
                            render={({
                              field: { onChange, onBlur, value, name },
                            }) => (
                              <FeedbackBoardselectMenu
                                className="basic-single max-w-[32rem]"
                                classNamePrefix="select"
                                name={name}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={
                                  value.value ? value : defaultFeedbackBoard
                                }
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>{"Status"}</FormLabel>
                        <FormControl>
                          <Controller
                            name="status"
                            control={form.control}
                            render={({
                              field: { onChange, onBlur, value, name },
                            }) => (
                              <Select
                                className="basic-single max-w-[32rem]"
                                classNamePrefix="select"
                                name={name}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={
                                  value.label !== ""
                                    ? value
                                    : FeedbackStatusOptions[0]
                                }
                                options={FeedbackStatusOptions}
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormLabel>{"Description"}</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter feedback post description"
                            id="description"
                            value={value}
                            onChange={onChange}
                            onModal="Feedbacks"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end px-0">
                <Button
                  className="mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
                  type="button"
                  onClick={handleCancelButton}
                >
                  {"Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white"
                  disabled={isSaving || isUploading}  
                >
                  {isSaving || isUploading ? "Submitting..." : "Submit Feedback"}
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
