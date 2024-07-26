import SideNav from "./changelogs/components/SideNav";
import NavPublic from "@/components/NavPublic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contents overflow-hidden">
      <div className={`sticky top-0 bg-gray-50 z-10`}>
        <NavPublic />
      </div>
      <div>{children}</div>
    </div>
  );
}
