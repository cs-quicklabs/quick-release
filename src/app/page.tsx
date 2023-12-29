import AuthForm from "@/components/AuthForm";
import LoginForm from "@/components/LoginForm";

export default async function Home() {
  return (
    <>
      <AuthForm
        title="Login to your account"
        description="Enter your email to login to quick release"
        isLoginForm={true}
      >
        <LoginForm />
      </AuthForm>
    </>
  );
}
