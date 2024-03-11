"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
// import { Navbar } from "@/components/Navbar";
// import Tiptap from "@/components/Tiptap";
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
import BaseTemplate from "@/templates/BaseTemplate";
import { ChangeLogType, FormChangeLogPost, IReleaseCategoriesOption, ReleaseTagsOption } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
// import { useMutation } from "react-query";
import Select from "react-select";
import * as z from "zod";

import ListboxButton, { ListboxOption } from "@/components/ListboxButton";
import DatePicker from "@/components/DatePicker";
import RichTextEditor from "@/components/RichTextEditor";
import { useChangeLogContext } from "@/app/context/ChangeLogContext";
import TimePicker from "@/components/TimePicker";
import moment from "moment";
import { ChangeLogsReleaseCategories, ChangeLogsReleaseTags, ChangeLogsReleaseActions } from "@/Utils/constants";
import { checkRichTextEditorIsEmpty } from "@/Utils";

const AddChangeLog = () => {
  const prevProps = useRef({
    isSaving: false,
  });

  const router = useRouter();
  const [activeUser, setActiveUser] = useState<any>({});
  const [activeProject, setActiveProject] = useState<Record<string, any>>({});

  const { error, createChangeLog } = useChangeLogContext();
  const [isSaving, setIsSaving] = useState(false);

  const actions: ListboxOption[] = useMemo(() => Object.values(ChangeLogsReleaseActions), []);
  const [selectedAction, setSelectedAction] = useState<ListboxOption>(actions[0]);

  const formSchema = z.object({
    title: z.string().min(1, { message: "Required" }),
    description: z.string().min(1, { message: "Required" }).refine(checkRichTextEditorIsEmpty, { message: "Required" }),
    releaseVersion: z.string().min(1, { message: "Required" }),
    releaseCategories: z.array(z.object({
      value: z.string(),
      label: z.string(),
    })
    ),
    // releaseTags: z.string().min(1, { message: "Required" }).max(50, {
    //   message: "Last Name can be maximum 50 characters",
    // }),
    releaseTags: z
      .array(
        z.object({
          value: z
            .string()
            .min(0, { message: "At least one category is required" }),
          label: z
            .string()
            .min(0, { message: "At least one category is required" })
        })
      )
      .refine((arr) => arr.length >= 0, {
        message: "At least one category is required",
      }),
    scheduledTime: z.date().optional()
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

  const getActiveUser = async () => {
    try {
      const res = await axios.get("/api/get-active-user");
      setActiveUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getActiveProject = async (userId: string) => {
    try {
      if (userId) {
        const res = await axios.get(`/api/get-active-project/${userId}`);
        setActiveProject(res.data);
      }
    } catch (err) {
      console.log(err, "err");
    }
  };

  useEffect(() => {
    getActiveUser();
  }, []);

  useEffect(() => {
    if (activeUser?.id) {
      getActiveProject(activeUser?.id);
    }
  }, [activeUser?.id]);

  const handleCreatePost: SubmitHandler<FormChangeLogPost> = (data) => {
    const changelogPost: ChangeLogType = {
      ...data,
      status: selectedAction.id,
      releaseCategories: data.releaseCategories.map(category => category.value),
      releaseTags: data.releaseTags.map(category => category.value),
      projectId: activeProject?.id,
      scheduledTime: selectedAction.id === "published" ? moment().toDate() : data.scheduledTime
    };

    createChangeLog(changelogPost, setIsSaving);
  };

  // const { mutate: createPost, isSaving } = useMutation({
  //   mutationFn: (newPost: IChangeLogPost) => {
  //     return axios.post(`/api/create-changeLogs/${activeProject?.id}`, newPost);
  //   },
  //   onError: (err) => {
  //     console.error(err);
  //   },
  //   onSuccess: () => {
  //     router.push("/allLogs");
  //     router.refresh();
  //   },
  // });

  const releaseCategoriesOptions: readonly IReleaseCategoriesOption[] = useMemo(() => Object.values(ChangeLogsReleaseCategories), []);
  const releaseTagsOptions: readonly ReleaseTagsOption[] = useMemo(() => Object.values(ChangeLogsReleaseTags), []);

  useEffect(() => {
    if (prevProps?.current?.isSaving && !isSaving) {
      if (!error) {
        router.replace("/allLogs");
      }
    }

    return () => {
      prevProps.current = {
        isSaving
      };
    };
  }, [isSaving]);


  return (
    <BaseTemplate>
      <>
        <div className="mx-auto max-w-2xl px-4 pt-10 pb-12 lg:pb-16">
          <Form {...form} >
            <form onSubmit={form.handleSubmit(handleCreatePost)}>
              <CardHeader className="space-y-1 px-0">
                <CardTitle className="text-lg font-medium leading-6 text-gray-900">
                  Add New Change Log
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-gray-500">
                  Let’s get started by filling in the information below to
                  create your new changelog.
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
                          {/* <Tiptap
                            description={field.value}
                            onChange={field.onChange}
                          /> */}

                          <RichTextEditor
                            placeholder="Enter change log description"
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

                <div className="grid gap-2">
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
                              <Select
                                isMulti
                                name={name}
                                options={releaseCategoriesOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onBlur={onBlur}
                                onChange={onChange}
                                value={value}
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
                              <Select
                                isMulti
                                name={name}
                                options={releaseTagsOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onBlur={onBlur}
                                onChange={(selectedOptions) => {
                                  onChange(selectedOptions);
                                }}
                                value={value}
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>

                {
                  selectedAction.id === "scheduled" &&
                  < div className="grid gap-2">
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
                                onChange={selectedDate => field.onChange(selectedDate ?? moment().toDate())}
                              />
                            </FormControl>

                            <FormControl>
                              <TimePicker
                                value={moment(field.value)}
                                onChange={(value) => field.onChange(value.toDate())}
                              />
                            </FormControl>
                          </div>

                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                }

              </CardContent>
              <CardFooter className="justify-end px-0">
                <Button className="mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
                  Cancel
                </Button>
                {/* <Button className="bg-blue-500 text-white" type="submit">
                  Create Change Log
                </Button> */}

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
    </BaseTemplate >
  );
};

export default AddChangeLog;
