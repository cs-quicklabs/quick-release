import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { supabase }: any = useOutletContext();
  console.log(supabase);
  return <div>Welcome to the Remix Project</div>;
}
