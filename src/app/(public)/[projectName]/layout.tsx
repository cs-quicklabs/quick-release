import NavPublic from "@/components/NavPublic";

export default async function Layout({ children }: { children: React.ReactNode; }) {
  return (
    <div className="contents">
      <NavPublic />

      {children}
    </div>
  );
}