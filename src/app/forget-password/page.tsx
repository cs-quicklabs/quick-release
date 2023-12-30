"use client";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "../../components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ForgotPassword = () => {
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgetPassword = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const res = await axios.post("/api/forget-password", values);
      toast({
        title: "Reset Link Sent Successfully",
      });
      setLoader(false);
    } catch (e: any) {
      toast({
        title: e.response.data,
      });

      setLoader(false);
    }
  };
  return (
    <AuthForm
      title="Reset Your Password"
      description="Enter email to recieve recovery link"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(forgetPassword)}>
          <div className="grid gap-2 pb-4">
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
          <Button type="submit">
            {loader ? (
              <>
                <span className="px-2">Send Reset Link </span>
                <Loader />
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ForgotPassword;
