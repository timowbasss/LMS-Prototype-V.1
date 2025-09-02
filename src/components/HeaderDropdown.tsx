import { Settings, Globe, Palette, Monitor, Sun, Moon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { ThemeCustomizer } from "@/components/ThemeCustomizer"
import { SpotlightSearch } from "@/components/SpotlightSearch"
import { useState, useEffect } from "react"

export function HeaderDropdown() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)
  const [spotlightOpen, setSpotlightOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSpotlightOpen(true)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

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
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSpotlightOpen(true)}
          className="hidden sm:flex items-center gap-2 text-muted-foreground"
        >
          <span className="text-sm">Search...</span>
          <Badge variant="secondary" className="text-xs">
            ⌘K
          </Badge>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 bg-card border shadow-large z-[100]"
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

            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => setShowThemeCustomizer(true)}
              className="cursor-pointer"
            >
              <Palette className="mr-2 h-4 w-4" />
              <span>Color Themes</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ThemeCustomizer 
        open={showThemeCustomizer} 
        onOpenChange={setShowThemeCustomizer} 
      />
      <SpotlightSearch 
        open={spotlightOpen} 
        onOpenChange={setSpotlightOpen} 
      />
    </>
  )
}