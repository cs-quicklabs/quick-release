"use client";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface User {
  createdAt: String;
  email: String;
  firstName: String;
  id: String;
  lastName: String;
  orgName: String;
  password: String;
  resetToken: String;
  resetTokenExpiry: String;
}

const ResetPassword = ({ params }: any) => {
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const formSchema = z.object({
    password: z
      .string()
      .min(1, { message: "Required" })
      .min(6, { message: "Password should be minimum 6 characters" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await axios.post("/api/verify-token", {
          token: params.token,
        });
        setVerified(true);
        const userData = await res.data;

        setUser(userData);
      } catch (error) {
        console.log(error);
        setVerified(true);
      }
    };
    verifyToken();
  }, [params.token]);

  const resetPassword = async (values: z.infer<typeof formSchema>, e: any) => {
    e.preventDefault();
    setLoader(true);
    const data = {
      ...values,
      email: user?.email,
    };

    try {
      await axios.post("/api/reset-password", data);
      toast({
        title: "Reset Successfully",
      });
      setLoader(false);
      router.push("/");
    } catch (error: any) {
      console.log(error);
      setLoader(false);
      toast({
        title: error.response.data,
      });
    }
  };
  return (
    <AuthForm title="Enter Your New Password">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(resetPassword)}>
          <div className="grid gap-2 pb-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter New Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" {...field} type="password" />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">
            {loader ? (
              <>
                <span className="px-2"> Reset Password </span>
                <Loader />
              </>
            ) : (
              " Reset Password"
            )}
          </Button>
        </form>
      </Form>
    </AuthForm>
  );
};

export default ResetPassword;
