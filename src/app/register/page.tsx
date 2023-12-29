"use client";

import AuthForm from "@/components/AuthForm";
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <>
      <AuthForm
        title="Create an account"
        description="Enter your details below to create your account"
      >
        <RegisterForm />
      </AuthForm>
    </>
  );
};

export default Register;
