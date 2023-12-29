import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "./ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import Link from "next/link";

const RegisterForm = () => {
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();
  const formSchema = z.object({
    firstName: z.string().min(1, { message: "Required" }).max(50, {
      message: "Fisrt Name can be maximum 50 characters",
    }),
    lastName: z.string().min(1, { message: "Required" }).max(50, {
      message: "Last Name can be maximum 50 characters",
    }),
    email: z
      .string()
      .min(1, { message: "Required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(6, { message: "Password should be minimum 6 characters" }),
    orgName: z.string().min(1, { message: "Required" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      orgName: "",
    },
  });

  async function createUser(values: z.infer<typeof formSchema>) {
    try {
      setLoader(true);
      const response = await axios.post("/api/register", values);
      setLoader(false);
      toast({
        title: response.data.message,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoader(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createUser)}>
          <div className="grid gap-2 pb-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2 pb-4">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
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
          <div className="grid gap-2 pb-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2 pb-4">
            <FormField
              control={form.control}
              name="orgName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organisation Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Organisation Name" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            {loader ? (
              <>
                <span className="px-2">Create account </span>
                <Loader />
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="relative flex justify-center text-md">
          <Link href="/">
            <span className="bg-background px-2 text-muted-foreground">
              Already have an account?
              <span className="font-bold text-black underline px-2">
                Log In
              </span>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default RegisterForm;
