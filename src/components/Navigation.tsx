import { NavLink } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
export const Navigation = () => {
  return <NavigationMenu className="mb-8">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>;
};