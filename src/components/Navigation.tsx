import { NavLink } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  return (
    <NavigationMenu className="mb-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  navigationMenuTriggerStyle(),
                  "bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card text-foreground hover:text-foreground",
                  isActive && "bg-primary text-primary-foreground"
                )
              }
            >
              🏠 Home
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavLink
              to="/agents"
              className={({ isActive }) =>
                cn(
                  navigationMenuTriggerStyle(),
                  "bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card text-foreground hover:text-foreground",
                  isActive && "bg-primary text-primary-foreground"
                )
              }
            >
              🤖 Agentes
            </NavLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};