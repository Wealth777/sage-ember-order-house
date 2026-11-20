import { Link, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Receipt, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";
import { logout } from "@/services/auth";

export function UserMenu({ user }: { user: User }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary outline-none ring-ring focus-visible:ring-2"
        aria-label="Account menu"
      >
        {initials(user.name)}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs font-normal capitalize text-muted-foreground">{user.role} account</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "customer" ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/orders"><Receipt /> My orders</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/profile"><UserIcon /> Profile</Link>
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild>
            <Link to={user.role === "admin" ? "/admin" : "/staff"}><LayoutDashboard /> Dashboard</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            logout(user);
            void navigate({ to: "/" });
          }}
        >
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
