import { Navbar } from "@/components/Navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="contents overflow-hidden">
      <div className={`sticky top-0 bg-gray-50 z-10`}>
        <Navbar />
      </div>
      <div>{children}</div>
    </div>
  );
}
