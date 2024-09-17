import SettingsNav from "@/components/SettingsNav";
import BaseTemplate from "@/templates/BaseTemplate";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BaseTemplate>
      <main className="max-w-7xl mx-auto pb-10 lg:py-12 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <SettingsNav isProfileSettings={true} isAccountSettings={false} />

          {children}
        </div>
      </main>
    </BaseTemplate>
  );
}
