import { useState, useEffect, JSX } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import { LayoutDashboard, BarChart, Calendar, DollarSign, Settings, LogOut, LucideIcon } from "lucide-react";
import { signOutAction } from '@/app/actions';
interface NavItem {
  href?: string;
  icon: LucideIcon;
  label: string;
}

interface NavLinkProps extends NavItem {
  active?: boolean;
}

export function SidebarNav(): JSX.Element {
  const pathname = usePathname();
  const t = useTranslations('Sidebar'); // Hook to fetch translations
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActive = (href?: string): boolean => {
    if (!mounted || !href) return false;
    return pathname === href;
  };

  const navItems: NavItem[] = [
    { href: "/home", icon: LayoutDashboard, label: t('dashboard') },
    { href: "/home/booking", icon: Calendar, label: t('booking') },
    { href: "/home/expenses", icon: DollarSign, label: t('expenses') },
    { href: "/home/analytics", icon: BarChart, label: t('analytics') },
  ];

  const bottomNavItems: NavItem[] = [
    { href: "/home/settings", icon: Settings, label: t('settings') },
    { icon: LogOut, label: t('logout') }, // No href for logout
  ];

  const NavLink: React.FC<NavLinkProps> = ({ href, icon: Icon, label }) => {
    const active = isActive(href);

    if (label === t('logout')) {
      return (
        <button
          onClick={signOutAction}
          className="
            flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left
            text-inactive-gray hover:text-primary/80 hover:bg-gray-50
            transition-all duration-200 ease-in-out
          "
        >
          <Icon className="w-5 h-5 text-inactive-gray transition-colors duration-200" />
          {label}
        </button>
      );
    }

    return (
      <Link
        href={href!}
        className={`
          flex items-center gap-3 px-4 py-2 rounded-lg
          relative transition-all duration-200 ease-in-out
          ${active 
            ? 'text-primary-text bg-primary/5 font-medium' 
            : 'text-inactive-gray hover:text-primary/80 hover:bg-gray-50'
          }
        `}
      >
        <Icon 
          className={`w-5 h-5 transition-colors duration-200
            ${active ? 'text-primary' : 'text-inactive-gray'}
          `}
        />
        {label}
        {active && (
          <div className="absolute left-0 top-0 h-full w-1 bg-accent rounded-r-md animate-slide-in" />
        )}
      </Link>
    );
  };

  return (
    <div className="w-1/5 min-w-[240px] border-r border-[#eaeaea] h-screen bg-secondary-bg p-4 flex flex-col">
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="text-primary font-bold text-2xl">My BnB.</div>
      </div>
      
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-2">
        {bottomNavItems.map((item) => (
          <NavLink key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}
