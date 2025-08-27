import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Grades from "./pages/Grades";
import Assignments from "./pages/Assignments";
import Forums from "./pages/Forums";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ivy-stem-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SidebarProvider>
              <div className="min-h-screen flex w-full bg-background">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                  <header className="h-14 border-b bg-background flex items-center justify-between px-4">
                    <div className="flex items-center">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h1 className="text-lg font-semibold text-foreground">Ivy STEM Learning Hub</h1>
                      </div>
                    </div>
                    <HeaderDropdown />
                  </header>
                  <main className="flex-1 p-6 overflow-auto">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/courses" element={<Courses />} />
                      <Route path="/grades" element={<Grades />} />
                      <Route path="/assignments" element={<Assignments />} />
                      <Route path="/forums" element={<Forums />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </div>
            </SidebarProvider>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
