"use client";

import { useTransition } from "react";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { setUserLocale } from "@/services/locale";
import { Locale } from "@/i18n/config";

interface Language {
  value: Locale;
  label: string;
}

interface LanguageSwitcherProps {
  defaultLanguage?: Locale;
  className?: string;
}

export function LanguageSwitcher({ defaultLanguage = "en", className }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const languages: Language[] = [
    { value: "en", label: "English" },
    { value: "ar", label: "العربية" },
  ];

  const handleLanguageChange = (language: Locale) => {
    startTransition(() => {
      setUserLocale(language);
    });
  };

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={className} disabled={isPending}>
                <Globe className="h-4 w-4" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="right">Change language</TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="min-w-[12rem]" align="end">
          <DropdownMenuLabel>Select Language</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.value}
              className="flex items-center gap-2"
              onClick={() => handleLanguageChange(language.value)}
            >
              {defaultLanguage === language.value ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <span className="w-4" />
              )}
              <span>{language.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
