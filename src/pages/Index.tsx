import { ComfyUIApp } from "@/components/ComfyUIApp";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex">
        <AppSidebar />
        
        <main className="flex-1">
          <header className="h-12 flex items-center border-b border-border/50 bg-card/90 backdrop-blur-sm">
            <SidebarTrigger className="ml-4" />
          </header>
          
          <ComfyUIApp />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
