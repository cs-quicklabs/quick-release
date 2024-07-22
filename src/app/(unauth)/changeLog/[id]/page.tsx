"use client";

import { checkRichTextEditorIsEmpty } from "@/Utils";
import {
  ChangeLogsReleaseActions,
} from "@/Utils/constants";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import { useProjectContext } from "@/app/context/ProjectContext";
import { useReleaseTagContext } from "@/app/context/ReleaseTagContext";
import DatePicker from "@/components/DatePicker";
import ListboxButton, { ListboxOption } from "@/components/ListboxButton";
import Loading from "@/components/Loading";
import ReleaseCategorySelectMenu from "@/components/ReleaseCategorySelectMenu";
import ReleaseTagSelectMenu from "@/components/ReleaseTagSelectMenu";
import TimePicker from "@/components/TimePicker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  IReleaseCategoriesOption,
  IReleaseCategory,
  IReleaseTag,
  ReleaseTagsOption,
} from "@/interfaces";
import BaseTemplate from "@/templates/BaseTemplate";
import { ChangeLogType, FormChangeLogPost } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, {
  use,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
// import { useMutation } from "react-query";
import Select, { GroupBase, MenuProps, components } from "react-select";
import * as z from "zod";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: true,
});

const AddChangeLog = ({ params }: { params: { id: string } }) => {
  const prevProps = useRef({
    isSaving: false,
    loading: false,
  });

  const router = useRouter();
  const { map: releaseTagMap, list: releaseTagIds } = useReleaseTagContext();
  const {
    error,
    createChangeLog,
    getChangeLog,
    updateChangeLog,
    getAllChangeLogs,
    list: changeLogsList,
    map: changeLogMap,
  } = useChangeLogContext();
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const actions: ListboxOption[] = useMemo(
    () => Object.values(ChangeLogsReleaseActions),
    []
  );
  const [selectedAction, setSelectedAction] = useState<ListboxOption>(
    actions[0]
  );

  const { activeProjectId, getActiveProject } = useProjectContext();

  const fetchChangeLog = useCallback(async () => {
    getAllChangeLogs({ projectId: activeProjectId! });
  }, [activeProjectId]);

  const changelog = useMemo(() => {
    return changeLogMap[params.id] || null;
  }, [changeLogMap[params.id]]);

  useEffect(() => {
    if (params.id !== "add") {
      fetchChangeLog();
    }
    getActiveProject(setIsLoading);
  }, [params.id]);

  useEffect(() => {
    if (params.id !== "add" && changeLogsList && changeLogsList.length > 0) {
      const changeLogId = changeLogsList.find(
        (changeLog) => changeLog === params.id
      );
      if (!changeLogId) {
        router.push("/error");
      }
    }
  }, [changeLogsList]);

  const formSchema = z.object({
    title: z.string().trim().min(1, { message: "Required" }).max(50, {
      message: "Title can not be more than 50 characters",
    }),
    description: z
      .string()
      .trim()
      .min(1, { message: "Required" })
      .refine(checkRichTextEditorIsEmpty, { message: "Required" }),
    releaseVersion: z.string().trim().min(1, { message: "Required" }).max(20,{
      message: "Release Version can not be more than 20 characters",
    }),
    releaseCategories: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    releaseTags: z
      .array(
        z.object({
          value: z
            .string()
            .min(0, { message: "At least one category is required" }),
          label: z
            .string()
            .min(0, { message: "At least one category is required" }),
        })
      )
      .refine((arr) => arr.length >= 0, {
        message: "At least one category is required",
      }),
    scheduledTime: z.date().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseVersion: "",
      releaseCategories: [],
      releaseTags: [],
      scheduledTime: moment().toDate(),
    },
  });

  const handleCreatePost: SubmitHandler<FormChangeLogPost> = (data) => {
    const changelogPost: ChangeLogType = {
      ...data,
      status: selectedAction.id,
      releaseCategories: data.releaseCategories.map(
        (category) => category.value
      ),
      releaseTags: data.releaseTags.map((category) => category.value),
      projectsId: activeProjectId!,
      scheduledTime:
        selectedAction.id === "published"
          ? moment().toDate()
          : data.scheduledTime,
    };

    if (params.id !== "add") {
      changelogPost.id = params.id;
      changelogPost.projectsId = changelog?.projects?.cuid;
      updateChangeLog(changelogPost, setIsSaving);
      return;
    }

    createChangeLog(changelogPost, setIsSaving);
  };

  useEffect(() => {
    const setDefaultValues = () => {
      if (changelog) {
        const selectedReleaseTags = changelog.releaseTags as IReleaseTag[];
        const selectedReleaseCategories =
          changelog.releaseCategories as IReleaseCategory[];

        form.reset({
          title: changelog.title,
          description: changelog.description,
          releaseVersion: changelog.releaseVersion,
          releaseCategories: selectedReleaseCategories.map((category) => ({
            value: category.code,
            label: category.name,
          })),
          releaseTags: selectedReleaseTags.map((tag) => ({
            value: tag.code,
            label: tag.name,
          })),
          scheduledTime: moment(changelog.scheduledTime).toDate(),
        });
      }
    };
    setDefaultValues();
  }, [changelog]);

  useEffect(() => {
    if (prevProps?.current?.isSaving && !isSaving) {
      if (!error) {
        router.replace("/allLogs");
      }
    }

    if (prevProps?.current?.loading && !loading) {
      if (error) {
        router.replace("/allLogs");
      }
    }

    return () => {
      prevProps.current = {
        isSaving,
        loading,
      };
    };
  }, [isSaving, loading]);

  if (!changelog && loading && params.id !== "add") {
    return (
      <BaseTemplate>
        <div className="w-full h-full flex items-center justify-center">
          <Loading />
        </div>
      </BaseTemplate>
    );
  }

  return (
    <BaseTemplate>
      <>
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-12 lg:pb-16">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePost)}>
              <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-lg font-medium leading-6 text-gray-900">
                  {params.id === "add"
                    ? "Add New Change Log"
                    : "Edit Change Log"}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-gray-500">
                  {params.id === "add"
                    ? "Let’s get started by filling in the information below to create your new changelog."
                    : "Let’s get started by filling in the information below to update your changelog."}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4 px-0">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter change log title"
                            {...field}
                            id="title"
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            placeholder="Enter change log description"
                            id="description"
                            value={value}
                            onChange={onChange}
                            onModal="ChangeLogs"
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
                    name="releaseVersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Version</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter release version"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 max-w-2xl">
                  <FormField
                    control={form.control}
                    name="releaseCategories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Categories (Optional)</FormLabel>
                        <FormControl>
                          <Controller
                            name="releaseCategories"
                            control={form.control}
                            render={({
                              field: { onChange, onBlur, value, name },
                            }) => (
                              <ReleaseCategorySelectMenu
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isMulti
                                name={name}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                                menuPlacement="top"
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2 max-w-2xl">
                  <FormField
                    control={form.control}
                    name="releaseTags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Tags (Optional)</FormLabel>
                        <FormControl>
                          <Controller
                            name="releaseTags"
                            control={form.control}
                            render={({
                              field: { onChange, onBlur, value, name },
                            }) => (
                              <ReleaseTagSelectMenu
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isMulti
                                name={name}
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
                                menuPlacement="top"
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedAction.id === "scheduled" && (
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="scheduledTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Release On</FormLabel>

                          <div className="grid gap-2 grid-cols-2">
                            <FormControl>
                              <DatePicker
                                className="justify-start bg-white"
                                {...field}
                                onChange={(selectedDate) =>
                                  field.onChange(
                                    selectedDate ?? moment().toDate()
                                  )
                                }
                              />
                            </FormControl>

                            <FormControl>
                              <TimePicker
                                value={moment(field.value)}
                                onChange={(value) =>
                                  field.onChange(value.toDate())
                                }
                              />
                            </FormControl>
                          </div>

                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end px-0">
                <Button
                  className="mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded"
                  type="button"
                  onClick={router.back}
                >
                  Cancel
                </Button>

                <ListboxButton
                  selected={selectedAction}
                  options={actions}
                  onChange={(value) => {
                    form.setValue("scheduledTime", moment().toDate());
                    setSelectedAction(value);
                  }}
                  btnType="submit"
                  loading={isSaving}
                  disabled={isSaving}
                />
              </CardFooter>
            </form>
          </Form>
        </div>
      </>
    </BaseTemplate>
  );
};

export default AddChangeLog;
