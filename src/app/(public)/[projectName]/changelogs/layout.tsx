import SideNav from "./components/SideNav";
import NavPublic from "@/components/NavPublic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contents overflow-hidden">
      <div>{children}</div>
    </div>
  );
}
