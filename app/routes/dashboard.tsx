import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Header from "~/components/header/Header";
import { getSession } from "~/session";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (!session.data.userId) {
    return null;
  }
  return session.data;
}

const Dashboard = () => {
  const loader: any = useLoaderData();
  console.log(loader);

  // function containsAuthTokenKey() {
  //   for (let i = 0; i < localStorage.length; i++) {
  //     const key = localStorage.key(i);

  //     if (key && localStorage!.getItem(key).includes("auth-token")) {
  //       return true;
  //     }
  //   }

  //   return false;
  // }

  return (
    <>
      <Header />
    </>
  );
};

export default Dashboard;
