import { type ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import Loader from "~/components/loader/Loader";
import { showError } from "~/components/toaster/Toaster";

export const action: ActionFunction = async ({ request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const form = await request.formData();
  const email = form.get("email");

  const { error, data } = await supabase.auth.signInWithOtp({
    email: email,
  });

  if (error) {
    return json({ error: error }, { status: 400 });
  }
  return json(data);
};

const ForgotPassword = () => {
  const actionData: any = useActionData();
  const transition = useNavigation();
  console.log("action", actionData);
  useEffect(() => {
    if (actionData?.error) {
      showError(actionData?.error.message);
    }
  }, [actionData?.error]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset Your Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {transition.state === "submitting" ? (
                <Loader />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
