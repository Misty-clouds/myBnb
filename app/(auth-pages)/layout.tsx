import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <div className="h-full w-full px-3 m-auto">
      {children}

    </div>
       
      

      

    </>
  );
}
