import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Crown,
  Plus,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CreateLeagueForm, JoinLeagueForm } from "./forms";

export const metadata: Metadata = {
  title: "My private leagues",
  description: "Create private leagues or join with a code to compete with friends and family in Polymatch.",
  alternates: { canonical: "/leagues" },
};

const LEAGUE_TEMPLATES = [
  {
    title: "Office bracket desk",
    members: "12-24 players",
    prize: "Champion route bonus",
    note: "Best for daily standings and quick matchday banter.",
  },
  {
    title: "Family host pool",
    members: "6-10 players",
    prize: "Golden boot pick",
    note: "Simple private code, clean leaderboard, low setup time.",
  },
  {
    title: "Analyst market room",
    members: "20+ players",
    prize: "Upset multiplier",
    note: "Great for prediction markets and deep fixture debates.",
  },
];

export default async function LeaguesPage() {
  const user = await requireUser();

  const memberships = await prisma.leagueMember.findMany({
    where: { userId: user.id },
    include: {
      league: {
        include: {
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Private leagues
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your private pool with family, the office, or friends. Each league has
          its own leaderboard calculated with the same points.
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="size-4 text-primary" />
              Create a league
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CreateLeagueForm />
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/70 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4 text-primary" />
              Join with code
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JoinLeagueForm />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg font-semibold">
          My leagues ({memberships.length})
        </h2>

        {memberships.length === 0 ? (
          <Card className="border-border/60 bg-card/60 backdrop-blur">
            <CardContent className="space-y-5 py-5">
              <div className="rounded-xl border border-primary/25 bg-primary/10 p-4">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  <Users className="size-3.5" />
                  private pool preview
                </div>
                <h3 className="mt-2 font-display text-xl font-bold">
                  Build a World Cup market room in one code
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Create a league for friends, office groups or family brackets.
                  Every pool gets its own leaderboard, invite code and champion
                  pick narrative.
                </p>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                {LEAGUE_TEMPLATES.map((template) => (
                  <div
                    key={template.title}
                    className="rounded-xl border border-border/60 bg-background/40 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <Trophy className="size-4 text-[color:var(--gold)]" />
                      <Badge variant="secondary" className="text-[10px]">
                        {template.members}
                      </Badge>
                    </div>
                    <div className="mt-3 font-display text-base font-semibold">
                      {template.title}
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-primary">
                      <ShieldCheck className="size-3.5" />
                      {template.prize}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {template.note}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <PoolStat icon={<CalendarDays className="size-4" />} label="Match windows" value="104" />
                <PoolStat icon={<Trophy className="size-4" />} label="Bonus picks" value="6" />
                <PoolStat icon={<Users className="size-4" />} label="Invite code" value="Private" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {memberships.map((m) => {
              const isOwner = m.league.ownerId === user.id;
              return (
                <li key={m.id}>
                  <Link
                    href={`/leagues/${m.league.slug}`}
                    className="group block rounded-xl outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Card className="h-full border-border/60 bg-card/60 transition-colors hover:border-primary/40 hover:bg-card">
                      <CardContent className="flex items-center justify-between gap-3 p-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate font-display text-base font-semibold">
                              {m.league.name}
                            </span>
                            {isOwner && (
                              <Badge variant="secondary" className="gap-1 text-[10px]">
                                <Crown className="size-3" />
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{m.league._count.members} {m.league._count.members === 1 ? "member" : "members"}</span>
                            <span>·</span>
                            <span className="font-mono">{m.league.code}</span>
                          </div>
                        </div>
                        <ArrowRight className="size-4 flex-none text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/ranking"
          className={buttonVariants({ variant: "outline", size: "sm" }) + " gap-1.5"}
        >
          Global leaderboard
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </main>
  );
}

function PoolStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>
      <div className="mt-2 font-display text-xl font-bold">{value}</div>
    </div>
  );
}
