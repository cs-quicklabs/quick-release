import NavPublic from "@/components/NavPublic";

export default async function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="contents h-full overflow-hidden">
      <NavPublic />

      <div className="h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
