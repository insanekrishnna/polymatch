import Link from "next/link";
import {
  CalendarDays,
  History,
  LogOut,
  Newspaper,
  Settings,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logoutAction } from "@/lib/actions/auth";
import { Brand } from "@/components/brand";
import { MobileNav, type MobileNavItem } from "@/components/mobile-nav";
import { NavbarWrapper } from "@/components/navbar-wrapper";

export async function Navbar() {
  const user = await getCurrentUser();

  const publicItems: MobileNavItem[] = [
    { href: "/fixtures", label: "Schedule", iconName: "CalendarDays" },
    { href: "/news", label: "News", iconName: "Newspaper" },
    { href: "/history", label: "History", iconName: "History" },
  ];

  const userItems: MobileNavItem[] = user
    ? [
        { href: "/predictions", label: "Predictions", iconName: "Swords" },
        { href: "/leagues", label: "Leagues", iconName: "Users" },
        { href: "/ranking", label: "Leaderboard", iconName: "Trophy" },
        ...(user.role === "ADMIN"
          ? [{ href: "/admin", label: "Admin", iconName: "Shield" }]
          : []),
      ]
    : [];

  const mobileItems: MobileNavItem[] = [
    ...publicItems,
    ...userItems,
    { href: "/settings", label: "Preferences", iconName: "Settings" },
  ];

  return (
    <NavbarWrapper>
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold tracking-tight"
        >
          <Brand size="md" />
          <span className="hidden text-sm font-light text-gray-500 sm:inline">
            World Cup 2026
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          <NavLink href="/fixtures" label="Schedule" />
          <NavLink href="/news" label="News" />
          <NavLink href="/history" label="History" />
          {user ? (
            <>
              <NavLink href="/predictions" label="Predictions" />
              <NavLink href="/leagues" label="Leagues" />
              <NavLink href="/ranking" label="Leaderboard" />
              {user.role === "ADMIN" && (
                <NavLink href="/admin" label="Admin" />
              )}
              <UserMenu
                name={user.name ?? "User"}
                email={user.email ?? null}
                image={user.image ?? null}
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 md:hidden">
          {user ? (
            <UserMenu
              name={user.name ?? "User"}
              email={user.email ?? null}
              image={user.image ?? null}
            />
          ) : (
            <Link
              href="/login"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              Sign in
            </Link>
          )}
          <MobileNav items={mobileItems} authed={!!user} />
        </div>
    </NavbarWrapper>
  );
}

function NavLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[14px] font-light text-gray-500 transition-colors hover:text-gray-900"
    >
      {label}
    </Link>
  );
}

function UserMenu({
  name,
  email,
  image,
}: {
  name: string;
  email: string | null;
  image: string | null;
}) {
  const initials =
    name
      .split(/\s+/)
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="User menu"
          />
        }
      >
        <Avatar className="h-8 w-8 border border-border">
          {image && (
            <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
          )}
          <AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-border">
              {image && (
                <AvatarImage
                  src={image}
                  alt={name}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-transparent text-xs font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{name}</div>
              {email && (
                <div className="truncate text-xs font-normal text-muted-foreground">
                  {email}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/settings" className="flex cursor-pointer items-center gap-2" />
          }
        >
          <Settings className="size-4" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={logoutAction}>
          <DropdownMenuItem
            nativeButton
            render={
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2"
              />
            }
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
