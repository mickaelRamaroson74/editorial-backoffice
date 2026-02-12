import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import NotFound from "./pages/NotFound";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ArticlesPage = lazy(() => import("./pages/ArticlesPage"));
const ArticleFormPage = lazy(() => import("./pages/ArticleFormPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const ImportPage = lazy(() => import("./pages/ImportPage"));

const queryClient = new QueryClient();

const Loading = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/new" element={<ArticleFormPage />} />
              <Route path="/articles/:id/edit" element={<ArticleFormPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/import" element={<ImportPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
