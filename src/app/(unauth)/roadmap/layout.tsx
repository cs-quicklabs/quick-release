import BaseTemplate from "@/templates/BaseTemplate";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseTemplate>
      <div className="flex h-full flex-col">
        <div
          className="md:flex md:items-center md:justify-between py-4 px-6"
          data-svelte-h="svelte-1a2r45a"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                {"Roadmap"}
              </h2>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </BaseTemplate>
  );
}
