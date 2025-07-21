import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const SidebarMenu = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      title: "📊 General",
      path: "/general",
    },
    {
      title: "📈 Informes de agentes",
      path: "/agents",
    },
  ];

  const getCurrentTitle = () => {
    const currentItem = menuItems.find(item => item.path === currentPath);
    return currentItem ? currentItem.title : "Menú";
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-card/90 backdrop-blur-sm border-border/50 hover:bg-card text-foreground hover:text-foreground flex items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            {getCurrentTitle()}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          className="bg-card/95 backdrop-blur-sm border-border/50 z-50"
        >
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.path} asChild>
              <NavLink
                to={item.path}
                className={cn(
                  "flex w-full cursor-pointer items-center px-3 py-2 text-sm transition-colors",
                  currentPath === item.path 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted text-foreground"
                )}
              >
                {item.title}
              </NavLink>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};