'use client';

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuContent} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import {SunIcon,MoonIcon,SunMoon} from "lucide-react";
import { useState } from "react";

export const ModeToggle = () => {
const {theme,setTheme} = useTheme();
const [mounted,setMounted] = useState(false);



  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button  variant="ghost" className="focus-visible:ring-0 focus-visible:ring-offset-0">
                {theme === "system" ? <SunMoon /> : theme === "dark" ?<MoonIcon/>: <SunIcon />}
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Button onClick={() => setTheme("system")} variant="ghost">System</Button>
            <Button onClick={() => setTheme("light")} variant="ghost">Light</Button>
            <Button onClick={() => setTheme("dark")} variant="ghost">Dark</Button>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}
