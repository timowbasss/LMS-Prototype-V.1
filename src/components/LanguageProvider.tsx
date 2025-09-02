import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "es" | "fr" | "zh" | "ar"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.courses": "Courses",
    "nav.grades": "Grades", 
    "nav.assignments": "Assignments",
    "nav.calendar": "Calendar",
    "nav.analytics": "Analytics",
    "nav.forums": "Forums",
    "nav.messages": "Messages",
    "nav.settings": "Settings",
    "welcome.title": "Welcome back, John! 👋",
    "welcome.subtitle": "Here's what's happening with your studies today.",
    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",
    "language.english": "English",
    "language.spanish": "Español",
    "language.french": "Français",
    "language.chinese": "中文",
    "language.arabic": "العربية",
    "pages.mindmap": "Mind Map",
    "pages.heatmap": "Heat Map",
    "pages.dependencies": "Dependency Tree",
    "pages.analytics": "Analytics",
    "pages.assignment": "Assignment",
    "pages.messages": "Messages",
    "pages.contact": "Contact Instructor",
    "pages.mindmap": "Mind Map",
    "pages.heatmap": "Heat Map", 
    "pages.dependencies": "Dependency Tree",
    "pages.analytics": "Analytics",
    "courses.enter": "Enter Course",
    "courses.assignments": "Assignments",
    "courses.gradebook": "Gradebook",
    "courses.syllabus": "Syllabus",
    "courses.schedule": "Schedule Session",
    "settings.title": "Settings",
    "settings.subtitle": "Customize your learning experience and accessibility preferences.",
    "calendar.title": "Calendar",
    "calendar.subtitle": "Manage your study sessions and view upcoming school events."
  },
  es: {
    "nav.dashboard": "Panel",
    "nav.courses": "Cursos",
    "nav.grades": "Calificaciones",
    "nav.assignments": "Tareas",
    "nav.calendar": "Calendario", 
    "nav.analytics": "Análisis",
    "nav.forums": "Foros",
    "nav.messages": "Mensajes",
    "nav.settings": "Configuración",
    "welcome.title": "¡Bienvenido de vuelta, John! 👋",
    "welcome.subtitle": "Esto es lo que está pasando con tus estudios hoy.",
    "theme.light": "Claro",
    "theme.dark": "Oscuro", 
    "theme.system": "Sistema",
    "language.english": "English",
    "language.spanish": "Español",
    "language.french": "Français",
    "language.chinese": "中文",
    "language.arabic": "العربية",
    "pages.mindmap": "Mapa Mental",
    "pages.heatmap": "Mapa de Calor",
    "pages.dependencies": "Árbol de Dependencias",
    "pages.analytics": "Análisis",
    "pages.assignment": "Tarea",
    "pages.messages": "Mensajes",
    "pages.contact": "Contactar Instructor",
    "pages.mindmap": "Mapa Mental",
    "pages.heatmap": "Mapa de Calor",
    "pages.dependencies": "Árbol de Dependencias", 
    "pages.analytics": "Análisis",
    "courses.enter": "Entrar al Curso",
    "courses.assignments": "Tareas",
    "courses.gradebook": "Libro de Calificaciones",
    "courses.syllabus": "Programa",
    "courses.schedule": "Programar Sesión",
    "settings.title": "Configuración",
    "settings.subtitle": "Personaliza tu experiencia de aprendizaje y preferencias de accesibilidad.",
    "calendar.title": "Calendario",
    "calendar.subtitle": "Gestiona tus sesiones de estudio y visualiza eventos escolares próximos."
  },
  fr: {
    "nav.dashboard": "Tableau de bord",
    "nav.courses": "Cours",
    "nav.grades": "Notes",
    "nav.assignments": "Devoirs",
    "nav.calendar": "Calendrier",
    "nav.analytics": "Analyses",
    "nav.forums": "Forums",
    "nav.messages": "Messages",
    "nav.settings": "Paramètres",
    "welcome.title": "Bon retour, John! 👋",
    "welcome.subtitle": "Voici ce qui se passe avec vos études aujourd'hui.",
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "theme.system": "Système",
    "language.english": "English",
    "language.spanish": "Español", 
    "language.french": "Français",
    "language.chinese": "中文",
    "language.arabic": "العربية",
    "pages.mindmap": "خريطة ذهنية",
    "pages.heatmap": "خريطة حرارية",
    "pages.dependencies": "شجرة التبعيات",
    "pages.analytics": "التحليلات",
    "pages.assignment": "المهمة",
    "pages.messages": "الرسائل",
    "pages.contact": "اتصل بالمدرس",
    "courses.enter": "دخول الدورة",
    "courses.assignments": "المهام",
    "courses.gradebook": "كتاب الدرجات",
    "courses.syllabus": "المنهج",
    "courses.schedule": "جدولة جلسة",
    "settings.title": "الإعدادات",
    "settings.subtitle": "خصص تجربة التعلم الخاصة بك وتفضيلات إمكانية الوصول.",
    "calendar.title": "التقويم",
    "calendar.subtitle": "إدارة جلسات الدراسة الخاصة بك وعرض الأحداث المدرسية القادمة."
  },
  zh: {
    "nav.dashboard": "仪表板",
    "nav.courses": "课程",
    "nav.grades": "成绩",
    "nav.assignments": "作业",
    "nav.calendar": "日历",
    "nav.analytics": "分析",
    "nav.forums": "论坛",
    "nav.messages": "消息",
    "nav.settings": "设置",
    "welcome.title": "欢迎回来，约翰！👋",
    "welcome.subtitle": "这是您今天学习的情况。",
    "theme.light": "浅色",
    "theme.dark": "深色",
    "theme.system": "系统",
    "language.english": "English",
    "language.spanish": "Español",
    "language.french": "Français", 
    "language.chinese": "中文",
    "language.arabic": "العربية",
    "pages.mindmap": "思维导图",
    "pages.heatmap": "热力图",
    "pages.dependencies": "依赖树",
    "pages.analytics": "分析",
    "pages.assignment": "作业",
    "pages.messages": "消息",
    "pages.contact": "联系导师",
    "courses.enter": "进入课程",
    "courses.assignments": "作业",
    "courses.gradebook": "成绩册",
    "courses.syllabus": "教学大纲",
    "courses.schedule": "安排会话",
    "settings.title": "设置",
    "settings.subtitle": "自定义您的学习体验和无障碍偏好。",
    "calendar.title": "日历",
    "calendar.subtitle": "管理您的学习会话并查看即将到来的学校活动。"
  },
  ar: {
    "nav.dashboard": "لوحة التحكم",
    "nav.courses": "الدورات",
    "nav.grades": "الدرجات",
    "nav.assignments": "المهام",
    "nav.calendar": "التقويم",
    "nav.analytics": "التحليلات",
    "nav.forums": "المنتديات",
    "nav.messages": "الرسائل",
    "nav.settings": "الإعدادات",
    "welcome.title": "مرحباً بعودتك، جون! 👋",
    "welcome.subtitle": "إليك ما يحدث مع دراستك اليوم.",
    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.system": "النظام",
    "language.english": "English",
    "language.spanish": "Español",
    "language.french": "Français",
    "language.chinese": "中文",
    "language.arabic": "العربية",
    "pages.mindmap": "Carte Mentale",
    "pages.heatmap": "Carte de Chaleur",
    "pages.dependencies": "Arbre de Dépendances",
    "pages.analytics": "Analyses",
    "pages.assignment": "Devoir",
    "pages.messages": "Messages",
    "pages.contact": "Contacter l'Instructeur",
    "courses.enter": "Entrer dans le Cours",
    "courses.assignments": "Devoirs",
    "courses.gradebook": "Carnet de Notes",
    "courses.syllabus": "Programme",
    "courses.schedule": "Programmer une Session",
    "settings.title": "Paramètres",
    "settings.subtitle": "Personnalisez votre expérience d'apprentissage et vos préférences d'accessibilité.",
    "calendar.title": "Calendrier",
    "calendar.subtitle": "Gérez vos sessions d'étude et visualisez les événements scolaires à venir."
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ivy-stem-language")
    return (saved as Language) || "en"
  })

  useEffect(() => {
    localStorage.setItem("ivy-stem-language", language)
    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}