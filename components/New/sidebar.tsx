import React from 'react';
import { Home, Calendar, WalletCards, BarChart2, Settings, Users, Bell, Heart, HelpCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const SidebarNav = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const menuItems = [
    {
      title: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      id: 'dashboard'
    },
    {
      title: 'Bookings',
      icon: Calendar,
      href: '/bookings',
      id: 'bookings',
      submenu: [
        { title: 'All Bookings', href: '/bookings/all' },
        { title: 'Pending', href: '/bookings/pending' },
        { title: 'Completed', href: '/bookings/completed' }
      ]
    },
    {
      title: 'Properties',
      icon: Building2,
      href: '/properties',
      id: 'properties'
    },
    {
      title: 'Expenses',
      icon: WalletCards,
      href: '/expenses',
      id: 'expenses'
    },
    {
      title: 'Analytics',
      icon: BarChart2,
      href: '/analytics',
      id: 'analytics'
    },
    {
      title: 'Guests',
      icon: Users,
      href: '/guests',
      id: 'guests'
    },
    {
      title: 'Wishlist',
      icon: Heart,
      href: '/wishlist',
      id: 'wishlist'
    },
    {
      title: 'Notifications',
      icon: Bell,
      href: '/notifications',
      id: 'notifications'
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      id: 'settings',
      submenu: [
        { title: 'Profile', href: '/settings/profile' },
        { title: 'Account', href: '/settings/account' },
        { title: 'Preferences', href: '/settings/preferences' }
      ]
    },
    {
      title: 'Help & Support',
      icon: HelpCircle,
      href: '/support',
      id: 'support'
    }
  ];

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col bg-white border-r">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary">MyBnb</h2>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <Collapsible className="w-full">
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center w-full p-3 rounded-lg text-sm",
                      activeItem === item.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="ml-9 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <a
                        key={subItem.href}
                        href={subItem.href}
                        className="block py-2 px-3 rounded-md text-sm hover:bg-gray-100"
                      >
                        {subItem.title}
                      </a>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center p-3 rounded-lg text-sm",
                    activeItem === item.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                  )}
                  onClick={() => setActiveItem(item.id)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.title}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden p-4">
            <Home className="h-6 w-6" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-primary">MyBnb</h2>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <Collapsible className="w-full">
                    <CollapsibleTrigger
                      className={cn(
                        "flex items-center w-full p-3 rounded-lg text-sm",
                        activeItem === item.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.title}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="ml-9 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <a
                          key={subItem.href}
                          href={subItem.href}
                          className="block py-2 px-3 rounded-md text-sm hover:bg-gray-100"
                          onClick={() => setIsOpen(false)}
                        >
                          {subItem.title}
                        </a>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center p-3 rounded-lg text-sm",
                      activeItem === item.id ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                    )}
                    onClick={() => {
                      setActiveItem(item.id);
                      setIsOpen(false);
                    }}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.title}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SidebarNav;