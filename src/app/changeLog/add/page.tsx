"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { use, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Label } from "@/components/ui/label";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Tiptap from "@/components/Tiptap";
import { FormChangeLogPost } from "@/types";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";

const AddChangeLog = () => {
  const router = useRouter();

  const formSchema = z.object({
    title: z.string().min(1, { message: "Required" }).max(50, {
      message: "Fisrt Name can be maximum 50 characters",
    }),
    description: z.string().min(1, { message: "Required" }),
    releaseVersion: z.string().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
    releaseCategory: z.string().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      releaseVersion: "",
      releaseCategory: "",
    },
  });

  const handleCreatePost: SubmitHandler<FormChangeLogPost> = (data) => {
    createPost(data);
  };

  const { mutate: createPost, isLoading } = useMutation({
    mutationFn: (newPost: FormChangeLogPost) => {
      return axios.post("/api/changelogs/create", newPost);
    },
    onError: (err) => {
      console.error(err);
    },
    onSuccess: () => {
      router.push("/allLogs");
      router.refresh();
    },
  });

  return (
    <>
      <Navbar />
      <MaxWidthWrapper>
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreatePost)}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Add New Change Log</CardTitle>
                <CardDescription>
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
                    name="releaseCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Release Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter release category"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-600" />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" type="submit">
                  Create Change Log
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </MaxWidthWrapper>
    </>
  );
};

export default AddChangeLog;
