import Link from "next/link";
import {
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { getCurrentUser } from "@/lib/session";
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

export async function Navbar() {
  const user = await getCurrentUser();

  const publicItems: MobileNavItem[] = [
    { href: "/fixtures",    label: "Schedule",    iconName: "CalendarDays" },
    { href: "/news",        label: "News",        iconName: "Newspaper"    },
    { href: "/history",     label: "History",     iconName: "History"      },
  ];

  const userItems: MobileNavItem[] = user
    ? [
        { href: "/predictions", label: "Predictions", iconName: "Swords" },
        { href: "/leagues",     label: "Leagues",     iconName: "Users"  },
        { href: "/ranking",     label: "Leaderboard", iconName: "Trophy" },
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
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-[1120px] px-4 md:px-8">
        {/* ── Floating pill ── */}
        <div className="mx-auto mt-3 flex h-14 items-center justify-between rounded-2xl border border-white/30 bg-white/10 px-5 text-black backdrop-blur-xl shadow-sm transition-all duration-300 hover:border-white/40 hover:bg-white/15">

          {/* ── Brand ── */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
          >
            <Brand size="md" />
          </Link>

          {/* ── Desktop nav links (center) ── */}
          <nav className="hidden items-center gap-6 md:flex">
            <NavLink href="/fixtures" label="Schedule" />
            <NavLink href="/news"     label="News"     />
            <NavLink href="/history"  label="History"  />
            {user && (
              <>
                <NavLink href="/predictions" label="Predictions" />
                <NavLink href="/leagues"     label="Leagues"     />
                <NavLink href="/ranking"     label="Leaderboard" />
                {user.role === "ADMIN" && (
                  <NavLink href="/admin" label="Admin" />
                )}
              </>
            )}
          </nav>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">

            {/* Desktop auth */}
            <div className="hidden items-center gap-3 md:flex">
              {user ? (
                <UserMenu
                  name={user.name   ?? "User"}
                  email={user.email ?? null}
                  image={user.image ?? null}
                />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-[13px] font-medium text-black/70 transition-all duration-200 hover:text-black"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-black/10 bg-black px-4 text-[13px] font-semibold tracking-[-0.01em] text-white shadow-[0_3px_10px_rgba(0,0,0,0.08)] transition-all duration-150 hover:-translate-y-[1px] hover:bg-black/90 hover:shadow-[0_6px_14px_rgba(0,0,0,0.12)] active:translate-y-0"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile auth + hamburger */}
            <div className="flex items-center gap-1 md:hidden">
              {user ? (
                <UserMenu
                  name={user.name   ?? "User"}
                  email={user.email ?? null}
                  image={user.image ?? null}
                />
              ) : (
                <Link
                  href="/login"
                  className="text-[13px] font-medium text-black/70 transition-all duration-200 hover:text-black"
                >
                  Sign in
                </Link>
              )}
              <MobileNav items={mobileItems} authed={!!user} />
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Nav link ── */
function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] font-medium text-black/70 transition-all duration-200 hover:text-black"
    >
      {label}
    </Link>
  );
}

/* ── User dropdown ── */
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
        <Avatar className="h-8 w-8 border border-white/40 shadow-sm">
          {image && (
            <AvatarImage src={image} alt={name} referrerPolicy="no-referrer" />
          )}
          <AvatarFallback className="bg-white/20 text-xs font-semibold text-black backdrop-blur-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 rounded-2xl border border-white/30 bg-white/70 shadow-lg backdrop-blur-xl"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-3 py-3">
            <Avatar className="h-9 w-9 border border-white/40">
              {image && (
                <AvatarImage
                  src={image}
                  alt={name}
                  referrerPolicy="no-referrer"
                />
              )}
              <AvatarFallback className="bg-white/20 text-xs font-semibold text-black">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-black">
                {name}
              </div>
              {email && (
                <div className="truncate text-[12px] font-normal text-black/50">
                  {email}
                </div>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="bg-black/8" />

        <DropdownMenuItem
          render={
            <Link
              href="/settings"
              className="flex cursor-pointer items-center gap-2 rounded-xl text-[13px] text-black/70 hover:text-black"
            />
          }
        >
          <Settings className="size-4 opacity-60" />
          Preferences
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-black/8" />

        <form action={logoutAction}>
          <DropdownMenuItem
            nativeButton
            render={
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2 rounded-xl text-[13px] text-black/70 hover:text-black"
              />
            }
          >
            <LogOut className="size-4 opacity-60" />
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}