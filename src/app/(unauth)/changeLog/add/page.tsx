"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Navbar } from "@/components/Navbar";
import Tiptap from "@/components/Tiptap";
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
import { FormChangeLogPost, ReleaseTagsOption } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import Select from "react-select";
import * as z from "zod";

const AddChangeLog = () => {
  const router = useRouter();
  const [activeUser, setActiveUser] = useState<any>([]);

  const formSchema = z.object({
    title: z.string().min(1, { message: "Required" }).max(50, {
      message: "Fisrt Name can be maximum 50 characters",
    }),
    description: z.string().min(1, { message: "Required" }),
    releaseVersion: z.string().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
    // releaseTags: z.string().min(1, { message: "Required" }).max(50, {
    //   message: "Last Name can be maximum 50 characters",
    // }),
    releaseTags: z
      .array(
        z.object({
          value: z
            .string()
            .min(0, { message: "At least one category is required" })
            .max(50, { message: "Category can be maximum 50 characters" }),
          label: z
            .string()
            .min(0, { message: "At least one category is required" })
            .max(50, { message: "Category can be maximum 50 characters" }),
        })
      )
      .refine((arr) => arr.length >= 0, {
        message: "At least one category is required",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseVersion: "",
      releaseTags: [],
    },
  });

  const getActiveUser = async () => {
    try {
      const res = await axios.get("/api/get-active-user");
      setActiveUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getActiveUser();
  }, []);
  const handleCreatePost: SubmitHandler<FormChangeLogPost> = (data) => {
    createPost(data);
  };

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: (newPost: FormChangeLogPost) => {
      return axios.post(`/api/create-changeLogs/${""}`, newPost);
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      router.push("/allLogs");
      router.refresh();
    },
  });
  const releaseTagsOptions: readonly ReleaseTagsOption[] = [
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <BaseTemplate>
      <MaxWidthWrapper>
        <div className="flex flex-col items-center justify-center">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePost)}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg font-medium leading-6 text-gray-900">
                  Add New Change Log
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-gray-500">
                  Let’s get started by filling in the information below to
                  create your new changelog.
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Tiptap
                            description={field.value}
                            onChange={field.onChange}
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
              </CardContent>
              <CardFooter className="justify-end">
                <Button className="mr-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded">
                  Cancel
                </Button>
                <Button className="bg-blue-500 text-white" type="submit">
                  Create Change Log
                </Button>
              </CardFooter>
            </form>
          </Form>
        </div>
      </MaxWidthWrapper>
    </BaseTemplate>
  );
};

export default AddChangeLog;
