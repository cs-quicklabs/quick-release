import SideNav from "./changelogs/components/SideNav";
import NavPublic from "@/components/NavPublic";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contents h-full overflow-hidden">
      <div className={`sticky top-0 bg-white z-10`}>
        <NavPublic />
      </div>
      <div>{children}</div>
    </div>
  );
}
