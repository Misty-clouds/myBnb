import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="max-w-7xl flex flex-col gap-12 m-auto items-center">
        {children}
      </div>
      <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-4 py-3">
        <p>
          Powered by{" "}
          <a
            href="mailto:clearclouds.001@gmail.com"
            target="_blank"
            className="font-bold hover:underline"
            rel="noreferrer"
          >
            CloudsTech
          </a>
        </p>
        <ThemeSwitcher />
      </footer>
    </>
  );
}
