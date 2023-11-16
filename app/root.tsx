import { cssBundleHref } from "@remix-run/css-bundle";
import { json, type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import stylesheet from "./styles/tailwind.css";
import toast, { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/protected-routes";

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : [{ rel: "stylesheet", type: "text/css", href: stylesheet }]),
];
export const loader = async () => {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };
  return json({ env });
};

export default function App() {
  const { env }: any = useLoaderData();
  const { toastMessage }: any = useLoaderData<typeof loader>();
  useEffect(() => {
    if (!toastMessage) {
      return;
    }
    toast(toastMessage);
  }, [toastMessage]);

  const [supabase] = useState(() =>
    createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* <ProtectedRoute> */}
        <Outlet context={{ supabase }} />
        {/* </ProtectedRoute> */}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
