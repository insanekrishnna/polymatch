import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Flame,
  MapPin,
  Radio,
  ShieldCheck,
  Swords,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Match Schedule",
  description:
    "Complete 2026 World Cup schedule: dates, venues and kickoff times for all 104 matches in USA, Canada and Mexico.",
  alternates: { canonical: "/fixtures" },
  openGraph: {
    title: "2026 World Cup Schedule",
    description:
      "Dates, venues and kickoff times for the 104 matches of the 2026 World Cup.",
    url: "/fixtures",
  },
};
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Flag } from "@/components/flag";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Stage } from "@/generated/prisma/enums";
import { getDatePrefs } from "@/lib/timezone-server";
import { dayKeyInTz, formatDate, formatInTz, todayKeyInTz } from "@/lib/datetime";
import type { DatePrefs } from "@/lib/timezone";

const STAGE_LABEL: Record<Stage, string> = {
  GROUP: "Group Stage",
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  TP: "Third Place",
  FINAL: "Final",
};

const STAGES: Stage[] = ["GROUP", "R32", "R16", "QF", "SF", "TP", "FINAL"];

const COUNTRY_LABEL: Record<string, string> = {
  USA: "United States",
  CAN: "Canada",
  MEX: "Mexico",
};

const COUNTRY_CODE_FOR_FLAG: Record<string, string> = {
  USA: "USA",
  CAN: "CAN",
  MEX: "MEX",
};

const FEATURED_FIXTURES = [
  {
    phase: "Opening Night",
    date: "11 Jun",
    time: "20:00 UTC",
    market: "First goal before 27:00",
    venue: "Estadio Azteca, Mexico City",
    teams: ["MEX", "TBD"],
    price: "61%",
  },
  {
    phase: "Host Watch",
    date: "12 Jun",
    time: "01:00 UTC",
    market: "USA opens with 2+ goals",
    venue: "SoFi Stadium, Los Angeles",
    teams: ["USA", "TBD"],
    price: "48%",
  },
  {
    phase: "Northern Line",
    date: "12 Jun",
    time: "22:00 UTC",
    market: "Canada clean sheet",
    venue: "BMO Field, Toronto",
    teams: ["CAN", "TBD"],
    price: "34%",
  },
];

const SCHEDULE_MARKETS = [
  { label: "Busiest matchday", value: "24 fixtures", note: "Group finale windows" },
  { label: "Fastest lock", value: "15 min", note: "Predictions freeze at kickoff" },
  { label: "Prime host window", value: "21:00 UTC", note: "North America evening slate" },
  { label: "Knockout swing", value: "R32", note: "32 teams enter the bracket board" },
];

export default async function FixturesPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; country?: string; team?: string }>;
}) {
  const { stage: stageRaw, country: countryRaw, team: teamRaw } = await searchParams;
  const stage = parseStage(stageRaw);
  const country = parseCountry(countryRaw);
  const teamCode = teamRaw?.toUpperCase();
  const prefs = await getDatePrefs();
  const tz = prefs.timezone;
  const today = todayKeyInTz(tz);

  const matches = await prisma.match.findMany({
    orderBy: [{ date: "asc" }, { matchNumber: "asc" }],
    include: {
      homeTeam: true,
      awayTeam: true,
      group: true,
    },
    where: {
      ...(stage ? { stage } : {}),
      ...(country ? { country } : {}),
      ...(teamCode
        ? {
            OR: [
              { homeTeam: { code: teamCode } },
              { awayTeam: { code: teamCode } },
            ],
          }
        : {}),
    },
  });

  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    select: { code: true, name: true },
  });

  // Group matches by ISO date (YYYY-MM-DD) in the user's timezone.
  const byDay = new Map<string, typeof matches>();
  for (const m of matches) {
    const key = dayKeyInTz(m.date, tz);
    const arr = byDay.get(key) ?? [];
    arr.push(m);
    byDay.set(key, arr);
  }
  const days = [...byDay.keys()].sort();

  const hasFilters = !!(stage || country || teamCode);

  return (
    <main className="mx-auto max-w-4xl flex-1 px-4 py-8">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Schedule
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All 104 World Cup 2026 matches, in chronological order.
        </p>
      </header>

      {/* Filters */}
      <div className="mb-6 space-y-3 rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm">
        <FilterRow label="Stage">
          <FilterChip href={hrefWith({ stage, country, teamCode }, { stage: undefined })} active={!stage}>
            All
          </FilterChip>
          {STAGES.map((s) => (
            <FilterChip
              key={s}
              href={hrefWith({ stage, country, teamCode }, { stage: s })}
              active={stage === s}
            >
              {STAGE_LABEL[s]}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Host Country">
          <FilterChip
            href={hrefWith({ stage, country, teamCode }, { country: undefined })}
            active={!country}
          >
            All
          </FilterChip>
          {(["USA", "CAN", "MEX"] as const).map((c) => (
            <FilterChip
              key={c}
              href={hrefWith({ stage, country, teamCode }, { country: c })}
              active={country === c}
            >
              <Flag code={COUNTRY_CODE_FOR_FLAG[c]} size="xs" className="mr-1" />
              {COUNTRY_LABEL[c]}
            </FilterChip>
          ))}
        </FilterRow>

        <FilterRow label="Team">
          <form action="/fixtures" className="flex items-center gap-2">
            <input type="hidden" name="stage" value={stage ?? ""} />
            <input type="hidden" name="country" value={country ?? ""} />
            <select
              name="team"
              defaultValue={teamCode ?? ""}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs"
            >
              <option value="">All</option>
              {teams.map((t) => (
                <option key={t.code} value={t.code}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
            <button
              type="submit"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Filter
            </button>
            {teamCode && (
              <Link
                href={hrefWith({ stage, country, teamCode }, { teamCode: undefined })}
                className={buttonVariants({ variant: "ghost", size: "sm" }) + " gap-1"}
              >
                <X className="size-3" /> {teamCode}
              </Link>
            )}
          </form>
        </FilterRow>

        <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
          <span>
            {matches.length > 0
              ? `${matches.length} ${matches.length === 1 ? "match" : "matches"} found`
              : "Sample schedule board"}
          </span>
          {hasFilters && (
            <Link
              href="/fixtures"
              className={buttonVariants({ variant: "ghost", size: "xs" }) + " gap-1"}
            >
              <X className="size-3" /> Clear Filters
            </Link>
          )}
        </div>
      </div>

      {/* Match list grouped by day */}
      {days.length === 0 ? (
        <ScheduleFallback hasFilters={hasFilters} />
      ) : (
        <div className="space-y-6">
          {days.map((day) => {
            const dayMatches = byDay.get(day)!;
            return (
              <section key={day}>
                <DayHeader dayKey={day} tz={tz} isToday={day === today} />
                <ul className="space-y-2">
                  {dayMatches.map((m) => (
                    <MatchCard key={m.id} match={m} prefs={prefs} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

function ScheduleFallback({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="space-y-5">
      {hasFilters && (
        <div className="rounded-xl border border-white/50 bg-white/30 p-4 text-sm text-gray-700 backdrop-blur-2xl shadow-sm">
          No official fixtures match the current filters, so this board is showing
          sample World Cup 2026 schedule markets.
        </div>
      )}

      <section className="terminal-card overflow-hidden rounded-xl">
        <div className="border-b border-border/40 bg-background/35 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <Radio className="size-3.5 text-gray-500" strokeWidth={1} />
                featured schedule board
              </div>
              <h2 className="mt-1 font-display text-2xl font-bold">
                World Cup 2026 kickoff windows
              </h2>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              sample markets
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 p-4 lg:grid-cols-3">
          {FEATURED_FIXTURES.map((fixture) => (
            <div
              key={fixture.phase}
              className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {fixture.phase}
                </div>
                <div className="rounded-lg bg-transparent px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                  {fixture.price}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <TeamToken code={fixture.teams[0]} />
                <span className="font-display text-sm font-semibold text-muted-foreground">
                  vs
                </span>
                <TeamToken code={fixture.teams[1]} />
              </div>
              <div className="mt-4 rounded-lg border border-white/40 bg-white/40 p-3 backdrop-blur-sm">
                <div className="font-display text-base font-semibold">
                  {fixture.market}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3" />
                    {fixture.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" />
                    {fixture.time}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="size-3" />
                <span className="truncate">{fixture.venue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SCHEDULE_MARKETS.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="size-4 text-gray-500" strokeWidth={1} />
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
                {item.label}
              </span>
            </div>
            <div className="mt-2 font-display text-2xl font-bold">
              {item.value}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          <Flame className="size-3.5 text-[color:var(--gold)]" />
          schedule angles
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Angle title="Host pressure" text="Track USA, Canada and Mexico windows separately as public sentiment moves around each kickoff." />
          <Angle title="Rest advantage" text="Compare teams with four-day breaks against opponents coming off compressed travel." />
          <Angle title="Bracket path" text="The Round of 32 starts the real volatility: one bad pick can move an entire champion route." />
        </div>
      </section>
    </div>
  );
}

function TeamToken({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/55 px-2.5 py-1">
      {code === "TBD" ? (
        <div className="h-4 w-6 rounded-sm border border-dashed border-border/70" />
      ) : (
        <Flag code={code} size="xs" />
      )}
      <span className="font-mono text-[11px] font-semibold">{code}</span>
    </div>
  );
}

function Angle({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/40 bg-white/40 p-3 backdrop-blur-sm">
      <div className="font-display text-sm font-semibold">{title}</div>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-[80px] text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary/60 bg-transparent text-primary"
          : "border-border/60 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

function DayHeader({
  dayKey,
  tz,
  isToday,
}: {
  dayKey: string;
  tz: string;
  isToday: boolean;
}) {
  // dayKey is YYYY-MM-DD. Build a noon-UTC date so weekday/month formatting
  // stays stable regardless of tz offset.
  const [y, mo, d] = dayKey.split("-").map(Number);
  const ref = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  const weekday = formatInTz(ref, tz, { weekday: "long" });
  const dayLabel = formatInTz(ref, tz, { day: "2-digit", month: "long" });

  return (
    <div className="sticky top-14 z-10 -mx-4 mb-3 flex items-center gap-2 border-b border-white/30 bg-white/20 px-4 py-2 backdrop-blur-xl sm:top-14 shadow-sm">
      <CalendarDays className="size-3.5 text-muted-foreground" />
      <h2 className="text-sm font-semibold uppercase tracking-wider">
        <span className="capitalize">{weekday}</span>,{" "}
        <span className="text-muted-foreground">{dayLabel}</span>
      </h2>
      {isToday && (
        <Badge className="ml-1 bg-primary text-primary-foreground">TODAY</Badge>
      )}
    </div>
  );
}

function MatchCard({
  match: m,
  prefs,
}: {
  prefs: DatePrefs;
  match: {
    id: number;
    matchNumber: number;
    stage: Stage;
    date: Date;
    venue: string;
    city: string;
    country: string;
    homeScore: number | null;
    awayScore: number | null;
    status: "SCHEDULED" | "LIVE" | "FINISHED";
    homePlaceholder: string | null;
    awayPlaceholder: string | null;
    homeTeam: { code: string; name: string } | null;
    awayTeam: { code: string; name: string } | null;
    group: { letter: string } | null;
  };
}) {
  const finished = m.homeScore !== null && m.awayScore !== null;
  const isLive = m.status === "LIVE";
  const timeLabel = formatDate(m.date, prefs, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <li className="overflow-hidden rounded-lg border border-white/50 bg-white/30 backdrop-blur-2xl transition-colors hover:border-white/80 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/30 bg-white/40 px-3 py-1.5 text-[10px] text-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-foreground/80">
            #{m.matchNumber}
          </span>
          {m.group ? (
            <Badge variant="secondary" className="text-[10px]">
              Group {m.group.letter}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[10px] gap-1">
              <Swords className="size-3" />
              {STAGE_LABEL[m.stage]}
            </Badge>
          )}
          {isLive && (
            <Badge className="bg-accent text-accent-foreground text-[10px]">
              LIVE
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Clock className="size-3" />
          <span className="tabular-nums">{timeLabel}</span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 py-3 sm:gap-4">
        <TeamSide
          align="end"
          team={m.homeTeam}
          placeholder={m.homePlaceholder}
        />
        <div className="flex min-w-[70px] flex-col items-center justify-center">
          {finished ? (
            <div className="font-display text-xl font-bold tabular-nums">
              {m.homeScore} <span className="text-muted-foreground">–</span> {m.awayScore}
            </div>
          ) : (
            <div className="font-display text-sm font-semibold text-muted-foreground">
              vs
            </div>
          )}
        </div>
        <TeamSide
          align="start"
          team={m.awayTeam}
          placeholder={m.awayPlaceholder}
        />
      </div>

      <div className="flex items-center gap-2 border-t border-white/30 bg-white/40 px-3 py-1.5 text-[10px] text-gray-700 backdrop-blur-sm">
        <MapPin className="size-3" />
        <span className="truncate">
          {m.venue} · {m.city}
        </span>
        <Flag code={m.country} size="xs" className="ml-auto" />
      </div>
    </li>
  );
}

function TeamSide({
  align,
  team,
  placeholder,
}: {
  align: "start" | "end";
  team: { code: string; name: string } | null;
  placeholder: string | null;
}) {
  const isEnd = align === "end";
  return (
    <div
      className={cn(
        "flex items-center gap-2.5",
        isEnd ? "justify-end" : "justify-start",
      )}
    >
      {isEnd && team && (
        <div className="text-right">
          <div className="font-display text-sm font-semibold leading-tight">
            {team.code}
          </div>
          <div className="text-[11px] text-muted-foreground">{team.name}</div>
        </div>
      )}
      {team ? (
        <Flag code={team.code} size="md" />
      ) : (
        <div className="flex items-center gap-2">
          <div className="h-5 w-[30px] rounded-[2px] border border-dashed border-border/50 bg-muted/30" />
          <span className="font-mono text-[11px] text-muted-foreground">
            {placeholder ?? "TBD"}
          </span>
        </div>
      )}
      {!isEnd && team && (
        <div className="text-left">
          <div className="font-display text-sm font-semibold leading-tight">
            {team.code}
          </div>
          <div className="text-[11px] text-muted-foreground">{team.name}</div>
        </div>
      )}
    </div>
  );
}

function parseStage(raw: string | undefined): Stage | null {
  if (raw && (STAGES as string[]).includes(raw)) return raw as Stage;
  return null;
}

function parseCountry(raw: string | undefined): "USA" | "CAN" | "MEX" | null {
  if (raw === "USA" || raw === "CAN" || raw === "MEX") return raw;
  return null;
}

function hrefWith(
  current: { stage: Stage | null; country: string | null; teamCode: string | undefined },
  patch: {
    stage?: Stage | undefined;
    country?: string | undefined;
    teamCode?: string | undefined;
  },
): string {
  const params = new URLSearchParams();
  const stage = "stage" in patch ? patch.stage : current.stage;
  const country = "country" in patch ? patch.country : current.country;
  const team = "teamCode" in patch ? patch.teamCode : current.teamCode;
  if (stage) params.set("stage", stage);
  if (country) params.set("country", country);
  if (team) params.set("team", team);
  const qs = params.toString();
  return qs ? `/fixtures?${qs}` : "/fixtures";
}
