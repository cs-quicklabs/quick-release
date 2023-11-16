import { type ActionFunction, json } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Loader from "~/components/loader/Loader";
import Modal from "~/components/modals/Modals";
import { showError } from "~/components/toaster/Toaster";

export const action: ActionFunction = async ({ request }) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return json({ error }, { status: 400 });
  } else return data;
};

export default function Register() {
  const fetcher: any = useFetcher();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (fetcher.state === "loading" && !fetcher?.data?.error) {
      setOpen(true);
    }
    if (open) {
      const timeoutId = setTimeout(() => {
        setOpen(false);
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [fetcher.state, open, fetcher.data?.error]);

  useEffect(() => {
    if (fetcher?.data?.error) showError(fetcher?.data?.error.message);
  }, [fetcher?.data?.error]);

  return (
    <>
      {open && <Modal open={open} setOpen={setOpen} />}
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <fetcher.Form className="space-y-6" method="post">
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
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                {fetcher.state === "submitting" ? <Loader /> : "Regsiter"}
              </button>
            </div>
          </fetcher.Form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
