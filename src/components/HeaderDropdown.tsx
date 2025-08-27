import { Settings, Globe, Palette, Monitor, Sun, Moon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/ThemeProvider"
import { useLanguage } from "@/components/LanguageProvider"

export function HeaderDropdown() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const languages = [
    { code: "en" as const, name: t("language.english"), flag: "🇺🇸" },
    { code: "es" as const, name: t("language.spanish"), flag: "🇪🇸" },
    { code: "fr" as const, name: t("language.french"), flag: "🇫🇷" },
    { code: "zh" as const, name: t("language.chinese"), flag: "🇨🇳" },
    { code: "ar" as const, name: t("language.arabic"), flag: "🇸🇦" },
  ]

  const themes = [
    { value: "light" as const, label: t("theme.light"), icon: Sun },
    { value: "dark" as const, label: t("theme.dark"), icon: Moon },
    { value: "system" as const, label: t("theme.system"), icon: Monitor },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-card/95 backdrop-blur-sm border shadow-large z-50"
      >
        <DropdownMenuLabel className="font-semibold">Preferences</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Theme Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Palette className="mr-2 h-4 w-4" />
            <span>Theme</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card/95 backdrop-blur-sm border shadow-large z-50">
            {themes.map((themeOption) => {
              const IconComponent = themeOption.icon
              return (
                <DropdownMenuItem
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className="cursor-pointer"
                >
                  <IconComponent className="mr-2 h-4 w-4" />
                  <span>{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Language Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <Globe className="mr-2 h-4 w-4" />
            <span>Language</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-card/95 backdrop-blur-sm border shadow-large z-50">
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className="cursor-pointer"
              >
                <span className="mr-2">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <Check className="ml-auto h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}