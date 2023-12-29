"use client";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "./ui/form";

const LoginForm = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

  const [loader, setLoader] = useState(false);
  const { toast } = useToast();
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(6, { message: "Password should be minimum 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginUser(values: z.infer<typeof formSchema>, e: any) {
    e.preventDefault();
    try {
      setLoader(true);
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });
      router.push("/allLogs");
      if (res?.error) {
        toast({
          title: res?.error as string,
        });
      }
    } catch (error) {
      if (error) {
        toast({
          title: error ? "Invalid Credentials" : "",
        });
      }
    } finally {
      setLoader(false);
    }
  }
  return (
    <>
      <div className={cn("grid gap-6")}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(loginUser)}>
            <div className="pb-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc@gmail.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <div className="pb-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="px-6">
              {loader ? (
                <>
                  <span className="px-2">Log In </span>
                  <Loader />
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Form>
        <div className="relative">
          <div className="relative flex justify-center text-md">
            <Link href="register">
              <span className="bg-background px-2 text-muted-foreground">
                Don&apos;t have an account?
                <span className="font-bold text-black underline px-2">
                  Sign up
                </span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
