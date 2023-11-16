import { type ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import React, { useEffect } from "react";
import Loader from "~/components/loader/Loader";
import { showError } from "~/components/toaster/Toaster";
import { getSession } from "~/session";

export const action: ActionFunction = async ({ request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const form = await request.formData();
  const password = form.get("password");
  const session = await getSession(request.headers.get("Cookie"));
  console.log("session", session);

  const { error, data } = await supabase.auth.updateUser({
    password,
    session,
  });

  if (error) {
    return json({ error: error }, { status: 400 });
  } else console.log("data", data);
};

const ChangePassword = () => {
  const actionData: any = useActionData();
  const transition = useNavigation();

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
          Set New Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Form className="space-y-6" method="post">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                "Set New Password"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;
