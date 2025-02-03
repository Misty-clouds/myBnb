import { Bell } from "lucide-react";
import { ThemeSwitcher } from "../theme-switcher";
import { useTranslations } from "next-intl";

export function RightSidebar() {
  const t = useTranslations("RightSidebar");

  const userData = {
    name: t("user"),
    status: t("admin"),
  };

  const username = t("user");

  return (
    <div className="w-[300px] border-l border-light-gray p-6 flex flex-col gap-6 bg-secondary-bg">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="mt-5">
            <div className="text-lg font-semibold text-primary-text">{t("hello")},</div>
            <div className="text-2xl font-bold text-primary-text">{`${username}!`}</div>
          </div>
        </div>
      </div>

      <div className="h-5"></div>

      <div className="bg-primary rounded-xl p-6 text-secondary-bg transition-transform duration-200 hover:scale-105">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">{userData.status}</div>
          <div className="bg-accent p-2 rounded-lg transition-transform duration-200 hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-secondary-bg">
              <path d="M12 8L18 14H6L12 8Z" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="text-sm opacity-80">
          {userData.status === t("admin") ? t("adminControl") : t("userExperience")}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-primary-text">{t("reminders")}</div>
          <div className="text-accent text-sm hover:text-accent/80 transition-colors duration-200 cursor-pointer">
            {t("viewAll")}
          </div>
        </div>

        {[
          { title: t("bookingNotifications"), color: "[#f35162]" },
        ].map((item, index) => (
          <div
            key={index}
            className="flex gap-4 p-4 bg-background rounded-lg transition-all duration-200 hover:transform hover:scale-105"
          >
            <div className={`p-2 bg-${item.color}/10 rounded-lg`}>
              <Bell className={`w-5 h-5 text-${item.color}`} />
            </div>
            <div>
              <div className="font-medium text-primary-text">{item.title}</div>
              <div className="text-sm text-muted-gray">{t("featureComing")}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-full"></div>
      <ThemeSwitcher />
    </div>
  );
}
