import { Home, Users, LogOut, Sun, Moon, Plus, FileText, Video, Volume2, Image, User } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const mainMenuItems = [
  {
    title: "General",
    path: "/general",
    icon: Home,
  },
];

const characterItems = [
  {
    title: "Nuevo Personaje",
    path: "/nuevo-personaje",
    icon: User,
  },
];

const videoCreationItems = [
  {
    title: "Guion",
    path: "/nuevo-guion",
    icon: FileText,
  },
  {
    title: "Audio",
    path: "/nuevo-audio",
    icon: Volume2,
  },
  {
    title: "Imagen",
    path: "/nuevo-video",
    icon: Image,
  },
];

const otherMenuItems = [
  {
    title: "Informes de agentes",
    path: "/agents",
    icon: Users,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const handleLogout = () => {
    // Clear any stored auth data
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon" style={{ minWidth: collapsed ? '56px' : '256px', maxWidth: collapsed ? '56px' : '256px' }}>
      <SidebarContent>
        {/* Logo section */}
        <div className="p-4 border-b border-sidebar-border/50">
          <div className="flex items-center justify-center">
            {!collapsed ? (
              <img 
                src="/lovable-uploads/496298ba-545a-4aea-9c8d-fb78f1a89456.png" 
                alt="Historias Infinitas Logo" 
                className="h-16 w-auto object-contain opacity-90 drop-shadow-sm"
              />
            ) : (
              <img 
                src="/lovable-uploads/496298ba-545a-4aea-9c8d-fb78f1a89456.png" 
                alt="Historias Infinitas Logo" 
                className="h-8 w-8 object-contain opacity-90"
              />
            )}
          </div>
        </div>

        {/* Main menu items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.path}
                      className={`${getNavCls({ isActive: currentPath === item.path })} flex items-center overflow-hidden w-full max-w-none px-2`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-2 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Character creation section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {characterItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild className="w-full">
                        <div className={`${getNavCls({ isActive: currentPath === item.path })} flex items-center overflow-hidden w-full max-w-none px-2 cursor-pointer opacity-60 hover:opacity-80 transition-opacity`}>
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                          {!collapsed && <span className="ml-2 truncate">{item.title}</span>}
                        </div>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="z-[99999] bg-popover border border-border shadow-2xl" sideOffset={10}>
                      <p>Próximamente</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Video creation section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-sidebar-foreground/70 px-2 truncate">
            {!collapsed && "Nuevo Video"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {videoCreationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.path}
                      className={`${getNavCls({ isActive: currentPath === item.path })} flex items-center overflow-hidden w-full max-w-none ${!collapsed ? 'pl-6 pr-2' : 'px-2'}`}
                    >
                      <item.icon className="h-3 w-3 flex-shrink-0" />
                      {!collapsed && <span className="ml-2 truncate text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other menu items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink
                      to={item.path}
                      className={`${getNavCls({ isActive: currentPath === item.path })} flex items-center overflow-hidden w-full max-w-none px-2`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="ml-2 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* Theme Toggle */}
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hover:bg-sidebar-accent flex items-center overflow-hidden"
            >
              <Sun className="h-4 w-4 flex-shrink-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 flex-shrink-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              {!collapsed && <span className="ml-2 truncate">{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout Button */}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="hover:bg-destructive/10 hover:text-destructive flex items-center overflow-hidden">
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2 truncate">Cerrar Sesión</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}