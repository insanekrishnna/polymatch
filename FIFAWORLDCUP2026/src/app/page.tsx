import Link from "next/link";
import {
  ArrowRight,
  Braces,
  Calendar,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock,
  Goal,
  MapPin,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Users,
  Zap,
  Lock,
  Search,
  Check,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { ComputeOrbScene } from "@/components/compute-orb-scene";
import { Flag } from "@/components/flag";
import { EDITIONS, type Edition, teamName } from "@/lib/world-cups";

const FEATURE_ROWS = [
  {
    eyebrow: "Prediction Engine",
    title: "Every pick is organized before kickoff chaos starts.",
    body: "Create scorelines, follow group scenarios and move through the tournament without losing context between fixtures, bracket paths and league standings.",
    icon: Braces,
    terminal: [
      ["polymatch.sync()", "ready"],
      ["groups.load(12)", "48 teams"],
      ["fixtures.lock()", "104 matches"],
      ["leaderboard.recompute()", "live"],
    ],
  },
  {
    eyebrow: "League Ops",
    title: "A focused control room for friends, pools and bragging rights.",
    body: "Invite players, compare tables and keep the competition moving with clean navigation across predictions, rankings and private league tools.",
    icon: Network,
    terminal: [
      ["league.create('office-pool')", "private"],
      ["invite.code", "active"],
      ["members.rank()", "synced"],
      ["admin.audit()", "clear"],
    ],
    flip: true,
  },
];

const BENEFITS = [
  {
    title: "Fast prediction flow",
    body: "Compact match cards and bracket views keep the primary task close: make a pick, move on, review later.",
    icon: Zap,
  },
  {
    title: "Tournament context",
    body: "Schedules, history and news sit beside the prediction workflow so users can make informed calls.",
    icon: CalendarClock,
  },
  {
    title: "Trustworthy scoring",
    body: "Scoring rules stay consistent across group picks, knockout routes, awards and leaderboards.",
    icon: ShieldCheck,
  },
  {
    title: "Social by default",
    body: "Private leagues, join codes and rankings make the product feel like a live competition, not a spreadsheet.",
    icon: Users,
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The pool finally feels organized. Everyone knows where to predict, where to compare and when fixtures matter.",
    name: "League admin",
  },
  {
    quote:
      "The bracket view makes the long tournament feel manageable, especially once knockout paths start changing.",
    name: "Power user",
  },
  {
    quote:
      "It has the right level of detail for a serious World Cup group without making casual players feel lost.",
    name: "Prediction group",
  },
];

const FAQS = [
  {
    question: "Does the redesign change scoring or prediction logic?",
    answer:
      "No. The UI changes keep backend logic, database calls and existing routes intact.",
  },
  {
    question: "Can users still manage private leagues?",
    answer:
      "Yes. The existing league routes, invite codes and ranking pages are preserved in the navigation.",
  },
  {
    question: "Is this built for mobile?",
    answer:
      "Yes. The layout collapses to single-column sections, full-width CTAs and the existing mobile sheet navigation.",
  },
];

type FirstMatch = {
  date: Date;
  venue: string;
  city: string;
  homeTeam: { code: string; name: string } | null;
  awayTeam: { code: string; name: string } | null;
} | null;

const FOOTER_LINKS = {
  Play: [
    { label: "Predictions", href: "/predictions" },
    { label: "Bracket", href: "/predictions/bracket" },
    { label: "Leagues", href: "/leagues" },
  ],
  Explore: [
    { label: "Schedule", href: "/fixtures" },
    { label: "News", href: "/news" },
    { label: "History", href: "/history" },
  ],
  Account: [
    { label: "Settings", href: "/settings" },
    { label: "Log in", href: "/login" },
    { label: "Register", href: "/register" },
  ],
};

const FEATURED_DAYS = [
  {
    date: "30 June",
    matches: [
      {
        home: "CIV",
        away: "NOR",
        time: "17:00 UTC",
        venue: "AT&T Stadium",
        city: "Arlington, Texas, USA",
      },
      {
        home: "FRA",
        away: "SWE",
        time: "21:00 UTC",
        venue: "MetLife Stadium",
        city: "East Rutherford, New Jersey, USA",
      },
      {
        home: "MEX",
        away: "ECU",
        time: "01:00 UTC (1 July)",
        venue: "Estadio Azteca",
        city: "Mexico City, Mexico",
      }
    ]
  },
  {
    date: "1 July",
    matches: [
      {
        home: "ENG",
        away: "COD",
        time: "16:00 UTC",
        venue: "Mercedes Benz Stadium",
        city: "Atlanta, Georgia, USA",
      },
      {
        home: "BEL",
        away: "SEN",
        time: "20:00 UTC",
        venue: "BMO Field",
        city: "Toronto, Ontario, Canada",
      },
      {
        home: "USA",
        away: "BIH",
        time: "00:00 UTC (2 July)",
        venue: "Levi's Stadium",
        city: "Santa Clara, California, USA",
      }
    ]
  },
  {
    date: "2 July",
    matches: [
      {
        home: "ESP",
        away: "AUT",
        time: "19:00 UTC",
        venue: "Hard Rock Stadium",
        city: "Miami Gardens, Florida, USA",
      },
      {
        home: "POR",
        away: "CRO",
        time: "23:00 UTC",
        venue: "GEHA Field at Arrowhead Stadium",
        city: "Kansas City, Missouri, USA",
      },
      {
        home: "SUI",
        away: "ALG",
        time: "03:00 UTC (3 July)",
        venue: "AT&T Stadium",
        city: "Arlington, Texas, USA",
      }
    ]
  }
];

function TeamToken({ code }: { code: string }) {
  if (code === "TBD") {
    return (
      <div className="flex items-center gap-1.5 rounded-full border border-border/40 px-2 py-1">
        <div className="size-3 rounded-full border border-dashed border-muted-foreground/30 bg-muted/30" />
        <span className="font-mono text-[10px] font-semibold text-muted-foreground">
          TBD
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border/40 bg-background/50 px-2 py-1">
      <Flag code={code} size="xs" />
      <span className="font-mono text-[10px] font-semibold text-foreground">
        {code}
      </span>
    </div>
  );
}

function EditionCard({ e }: { e: Edition }) {
  return (
    <li className="group relative overflow-hidden rounded-xl border border-white/50 bg-white/30 backdrop-blur-2xl transition-colors hover:border-white/80 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 font-display text-[5rem] font-black leading-none text-foreground/[0.06]"
      >
        {e.year}
      </div>

      <div className="relative space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
          <Badge variant="secondary" className="text-[10px]">
            #{e.editionNumber}
          </Badge>
          <span className="font-semibold text-foreground">{e.year}</span>
          <span>-</span>
          <MapPin className="size-3" />
          {e.hosts.map((h, i) => (
            <span key={h} className="inline-flex items-center gap-1">
              <Flag code={h} size="xs" />
              <span>{teamName(h)}</span>
              {i < e.hosts.length - 1 && (
                <span className="mx-0.5 text-muted-foreground/60">+</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 text-right">
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--gold)]">
                Champion
              </div>
              <div className="truncate font-display text-sm font-semibold">
                {teamName(e.champion)}
              </div>
            </div>
            <Flag
              code={e.champion}
              size="lg"
              className="!bg-contain !bg-center ring-2 ring-[color:var(--gold)]/40"
            />
          </div>

          <div className="flex shrink-0 flex-col items-center px-1">
            <div className="font-display text-lg font-bold tabular-nums">
              {e.scoreHome} <span className="text-muted-foreground">-</span>{" "}
              {e.scoreAway}
            </div>
            {e.decision && (
              <span className="rounded-sm border border-border/60 px-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                {e.decision === "aet" ? "a.e.t." : `pen ${e.penalties}`}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <Flag code={e.runnerUp} size="lg" className="!bg-contain !bg-center" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Runner-up
              </div>
              <div className="truncate font-display text-sm font-semibold">
                {teamName(e.runnerUp)}
              </div>
            </div>
          </div>
        </div>

        {e.note && (
          <p className="border-l-2 border-border/60 pl-2 text-[11px] italic text-muted-foreground">
            {e.note}
          </p>
        )}
      </div>
    </li>
  );
}

export default async function HomePage() {
  const [user, firstMatch, counts] = await Promise.all([
    getCurrentUser(),
    prisma.match.findFirst({
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    getCounts(),
  ]);

  const editionsDesc = [...EDITIONS].sort((a, b) => b.year - a.year);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Polymatch",
        inLanguage: "en",
        description:
          "World Cup 2026: Predict match scores, build your bracket and compete with friends.",
      },
      {
        "@type": "SportsEvent",
        name: "FIFA World Cup 2026",
        startDate: "2026-06-11",
        endDate: "2026-07-19",
        sport: "Football",
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode:
          "https://schema.org/OfflineEventAttendanceMode",
        location: [
          { "@type": "Country", name: "United States" },
          { "@type": "Country", name: "Canada" },
          { "@type": "Country", name: "Mexico" },
        ],
        organizer: {
          "@type": "Organization",
          name: "FIFA",
          url: "https://www.fifa.com",
        },
      },
    ],
  };

  const displayCounts = {
    matches: counts.matches >= 104 ? counts.matches : 104,
    teams: counts.teams >= 48 ? counts.teams : 48,
    groups: counts.groups >= 12 ? counts.groups : 12,
    users: counts.users,
  };

  const primaryHref = user ? "/predictions" : "/register";
  const primaryLabel = user ? "Open predictions" : "Get started";
  const secondaryHref = user ? "/predictions/bracket" : "/login";
  const secondaryLabel = user ? "View bracket" : "Log in";

  return (
    <main className="flex-1 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative min-h-[calc(100vh-4rem)]">
        <div className="relative z-10 mx-auto flex max-w-[1400px] items-start pt-5 pb-20 px-4 sm:px-6 md:px-8">
          <div className="grid w-full items-center gap-10 md:gap-12 lg:gap-16 grid-cols-1 lg:grid-cols-[4fr_6fr] xl:grid-cols-[45fr_55fr]">
            
            {/* Left Side Typography */}
            <div className="w-full max-w-xl mx-auto lg:mx-0 text-left">
              <div className="animate-on-scroll mb-4 flex items-center justify-start gap-3 text-sm font-medium text-gray-700 tracking-wide uppercase">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/2 border border-black/10 px-4 py-2 text-xs font-medium text-gray-800 transition-colors hover:bg-black/10 hover:border-black/20">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>World Cup 2026</span>
                </span>
              </div>
              
              <h1 className="animate-on-scroll text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-semibold text-gray-900 tracking-tight">
                Predict. <span className="text-accent-gradient">Compete.</span><br/>
                <span className="text-accent-gradient">Win the pool.</span>
              </h1>
              
              <p className="animate-on-scroll mt-5 sm:mt-7 max-w-[400px] text-base sm:text-[17px] font-normal leading-relaxed text-gray-800">
                Ship score picks, brackets, private leagues and live rankings in one clean interface built for serious tournament players.
              </p>
              
              <div className="animate-on-scroll mt-6 flex flex-wrap gap-4 sm:gap-5">
                <Link href={primaryHref} className={buttonVariants({ size: "lg" }) + " w-full sm:w-auto gap-1"}>
                  {primaryLabel} <ArrowRight className="size-4" />
                </Link>
                <Link href={secondaryHref} className={buttonVariants({ size: "lg", variant: "outline" }) + " w-full sm:w-auto !text-black"}>
                  {secondaryLabel}
                </Link>
              </div>
              
              <div className="animate-on-scroll mt-12 sm:mt-23 flex flex-wrap items-center justify-between gap-4 sm:justify-start rounded-xl border border-white/50 bg-white/20 px-5 py-3 backdrop-blur-xl w-full sm:w-fit">
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-[28px] font-light text-gray-900 leading-none">{displayCounts.teams}</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase mt-1.5 tracking-wider">Teams</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-[28px] font-light text-gray-900 leading-none">{displayCounts.matches}</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase mt-1.5 tracking-wider">Matches</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl sm:text-[28px] font-light text-gray-900 leading-none">{displayCounts.users}</span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 uppercase mt-1.5 tracking-wider">Predictors</span>
                </div>
              </div>
            </div>

            {/* Right: Glass Card matching Metamaxx reference */}
            <div className="animate-on-scroll w-full max-w-2xl mx-auto lg:max-w-none">
              <div className="relative overflow-hidden rounded-xl border border-white/60 bg-white/38 text-left backdrop-blur-2xl w-full">
                
                {/* Top Mac Bar */}
                <div className="grid grid-cols-3 items-center border-b border-white/55 bg-white/30 px-4 py-2.5 backdrop-blur-xl sm:px-5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]"></span>
                  </div>
                  <div className="flex justify-center">
                    <div className="hidden items-center gap-2 rounded-md border border-white/60 bg-white/34 px-4 py-1.5 text-[11px] font-medium text-[#000000] backdrop-blur-xl sm:flex">
                      <Lock className="size-3 text-gray-800" strokeWidth={2} />
                      polymatch.online
                    </div>
                  </div>
                  <div className="flex justify-end text-[#6B7280]">
                    <Search className="size-4 text-gray-900" strokeWidth={1.8} />
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="grid gap-3 p-4 sm:p-5 min-[360px]:gap-3.5">
                  <div className="min-w-0">
                    <div className="flex flex-col gap-2.5 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="text-[10px] font-normal uppercase tracking-widest text-[#616674]">Tournament Runtime</p>
                        <h2 className=" break-words text-[21px] font-medium text-[#000] min-[360px]:text-[22px]">polymatch.online</h2>
                      </div>
                      <div className="inline-flex w-fit items-center gap-1 rounded-md border border-black/60 bg-blue/38 px-3 py-1 text-[10px] font-medium text-[#000] backdrop-blur-xl">
                        <Radio className="size-3" />
                        <span>Live</span>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="min-w-0 rounded-lg border border-white/60 bg-white/38 p-3 backdrop-blur-xl transition-colors hover:border-white/90 min-[360px]:p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[27px] font-normal leading-none text-[#0A0A0F] min-[360px]:text-[31px]">{displayCounts.teams}</p>
                    
                        </div>
                        <p className="shrink-0 font-medium  mt-2.5 text-[10px] font-light text-[10px] text-[#4F46E5] uppercase truncate">Teams</p>
                      </div>
                      
                      <div className="min-w-0 rounded-lg border border-white/60 bg-white/38 p-3 backdrop-blur-xl transition-colors hover:border-white/90 min-[360px]:p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[27px] font-normal leading-none text-[#0A0A0F] min-[360px]:text-[31px]">{displayCounts.matches}</p>
                          
                        </div>
                        <p className="shrink-0 font-medium  mt-2.5 text-[10px] font-light text-[10px] text-[#4F46E5] uppercase truncate">Matches</p>
                      </div>

                      <div className="min-w-0 rounded-lg border border-white/60 bg-white/38 p-3 backdrop-blur-xl transition-colors hover:border-white/90 min-[360px]:p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[27px] font-normal leading-none text-[#0A0A0F] min-[360px]:text-[31px]">{displayCounts.groups}</p>
                          
                        </div>
                        <p className="shrink-0 font-medium  mt-2.5 text-[10px] font-light text-[10px] text-[#4F46E5] uppercase truncate">Groups</p>
                      </div>

                      <div className="min-w-0 rounded-lg border border-white/60 bg-white/38 p-3 backdrop-blur-xl transition-colors hover:border-white/90 min-[360px]:p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[27px] font-normal leading-none text-[#0A0A0F] min-[360px]:text-[31px]">{displayCounts.users}+</p>
                      
                        </div>
                        <p className="shrink-0 font-medium  mt-2.5 text-[10px] font-light text-[10px] text-[#4F46E5] uppercase truncate">Users Playing</p>
                      </div>
                    </div>

                    {/* System Status Lists */}
                    <div className="mt-3.5 overflow-hidden rounded-lg border border-white/60 bg-white/34 backdrop-blur-xl">
                      
                      <div className="flex items-center justify-between gap-2.5 border-b border-white/60 px-3 py-2.5 last:border-b-0 min-[360px]:gap-3 min-[360px]:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">
                            <Check className="size-4" strokeWidth={1.9} />
                          </span>
                          <span className="min-w-0 truncate text-[12px] font-normal text-[#374151]/90 min-[360px]:text-[13px]">Prediction engine is active</span>
                        </div>
                        <span className="shrink-0 rounded-md border px-2 py-1 text-[10px] font-medium backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">Pass</span>
                      </div>

                      <div className="flex items-center justify-between gap-2.5 border-b border-white/60 px-3 py-2.5 last:border-b-0 min-[360px]:gap-3 min-[360px]:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">
                            <Check className="size-4" strokeWidth={1.9} />
                          </span>
                          <span className="min-w-0 truncate text-[12px] font-normal text-[#374151]/90 min-[360px]:text-[13px]">Prediction flow is working </span>
                        </div>
                        <span className="shrink-0 rounded-md border px-2 py-1 text-[10px] font-medium backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">Pass</span>
                      </div>

                      <div className="flex items-center justify-between gap-2.5 border-b border-white/60 px-3 py-2.5 last:border-b-0 min-[360px]:gap-3 min-[360px]:px-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">
                            <Check className="size-4" strokeWidth={1.9} />
                          </span>
                          <span className="min-w-0 truncate text-[12px] font-normal text-[#374151]/90 min-[360px]:text-[13px]">League rankings is updated </span>
                        </div>
                        <span className="shrink-0 rounded-md border px-2 py-1 text-[10px] font-medium backdrop-blur-xl border-white/60 bg-white/40 text-[#4F46E5]">Pass</span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Schedule Board */}
      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 pb-10">
        <div className="border-b border-border/40 px-4 py-3">
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

        <div className="grid gap-4 mt-6 lg:grid-cols-3 w-full">
          {FEATURED_DAYS.map((day) => (
            <Link href="/fixtures" key={day.date} className="block group">
              <div className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm transition-all group-hover:border-white/80 group-hover:shadow-md cursor-pointer h-full flex flex-col">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-700 flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    {day.date}
                  </div>
                  <div className="rounded-full bg-transparent px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                    3 Matches
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 flex-1">
                  {day.matches.map((match, idx) => (
                    <div key={idx} className="rounded-lg border border-white/40 bg-white/40 p-3 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <TeamToken code={match.home} />
                        <span className="font-display text-[10px] font-semibold text-gray-700">
                          vs
                        </span>
                        <TeamToken code={match.away} />
                      </div>
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-700">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {match.time}
                        </span>
                        <span className="inline-flex items-center gap-1 truncate max-w-[200px]">
                          <MapPin className="size-3" />
                          <span className="truncate">{match.venue}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 pb-10">
        <div className="border-b border-border/40 px-4 py-3 mb-6">
          <h2 className="flex items-center gap-2 font-display text-xl font-bold">
            <Calendar className="size-5 text-gray-500" strokeWidth={1} />
            All Editions
          </h2>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {editionsDesc.slice(0, 6).map((e) => (
            <EditionCard key={e.year} e={e} />
          ))}
        </ul>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-b border-border/40 pb-3 mb-4 text-left">
            <h2 className="font-display text-xl font-bold">
              Designed for the full prediction lifecycle.
            </h2>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {FEATURE_ROWS.map((feature) => (
              <FeatureRow key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="border-b border-border/40 pb-3 mb-4 text-left">
            <h2 className="font-display text-xl font-bold">
              A premium shell around the tournament tools users need.
            </h2>
          </div>
          <div className="animate-on-scroll animate-stagger mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm transition-colors duration-200 hover:border-white/80"
                >
                  <div className="flex items-center gap-2 border-b border-white/20 pb-2">
                    <Icon className="size-4 text-gray-600" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold text-gray-900">{benefit.title}</h3>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-gray-800">
                    {benefit.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[var(--bg-secondary)] py-12">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={<Users className="size-5" />} value={displayCounts.users} label="Users" />
          <Stat icon={<Goal className="size-5" />} value={displayCounts.matches} label="Matches" />
          <Stat icon={<Trophy className="size-5" />} value={displayCounts.groups} label="Groups" />
          <Stat icon={<Sparkles className="size-5" />} value={displayCounts.teams} label="Teams" />
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            eyebrow="Signals"
            title="Built for groups that take the tournament seriously."
            body="The product keeps the competitive layer readable for admins, power users and casual friends in the same league."
          />
          <div className="animate-on-scroll animate-stagger mt-12 grid gap-5 lg:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure
                key={item.name}
                className="rounded-lg border border-border bg-card p-6"
              >
                <blockquote className="text-base leading-7 text-foreground">
                  "{item.quote}"
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="size-4 text-gray-500" strokeWidth={1} />
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-[var(--bg-secondary)] py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionIntro
            eyebrow="FAQ"
            title="The redesign is visual. The product stays familiar."
            body="Core functionality remains mapped to the same routes, actions and database-backed views."
          />
          <div className="animate-on-scroll mt-10 space-y-3">
            {FAQS.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-border bg-background p-5 open:border-[var(--border-hover)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-medium">
                  {item.question}
                  <ChevronDown className="size-4 text-muted-foreground transition-transform duration-150 group-open:rotate-180" />
                </summary>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="section-eyebrow animate-on-scroll mx-auto">
            Final whistle ready
          </div>
          <h2 className="animate-on-scroll mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            Make your 2026 pool feel like a premium product.
          </h2>
          <p className="animate-on-scroll mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Start with predictions, invite your league and let the leaderboard
            carry the tournament from opening match to final.
          </p>
          <div className="animate-on-scroll mt-8">
            <Link href={primaryHref} className={buttonVariants({ size: "lg" }) + " gap-2"}>
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-[var(--bg-secondary)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid size-7 place-items-center rounded-md border border-primary/25 bg-primary text-primary-foreground">
                <Trophy className="size-4" />
              </span>
              Polymatch
            </div>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A World Cup prediction platform for brackets, scorelines, leagues
              and rankings.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <FooterColumn key={title} title={title} links={links} />
          ))}
        </div>
        <div className="border-t border-border py-5 text-center text-sm text-muted-foreground">
          © 2026 Polymatch. Built for World Cup pools.
        </div>
      </footer>
    </main>
  );
}

function StatusRow({ label, status }: { label: string; status: string }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 py-3 last:border-0 hover:bg-black/5 px-2 rounded-md transition-colors -mx-2">
      <span className="text-[13px] font-light text-gray-700">{label}</span>
      <span className="inline-flex items-center gap-2 text-[11px] font-medium text-primary">
        <span className="size-1.5 rounded-full bg-primary" />
        {status}
      </span>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="animate-on-scroll mx-auto max-w-2xl text-center">
      <div className="section-eyebrow mx-auto">{eyebrow}</div>
      <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">
        {title}
      </h2>
      <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function FeatureRow({
  eyebrow,
  title,
  body,
  icon: Icon,
  terminal,
  flip,
}: {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  terminal: string[][];
  flip?: boolean;
}) {
  return (
    <div
      className={`animate-on-scroll grid items-center gap-6 lg:grid-cols-2 ${
        flip ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div className="rounded-xl border border-white/50 bg-white/30 p-4 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-white/20 pb-3 font-mono text-xs text-muted-foreground">
          <Icon className="size-4 text-primary" strokeWidth={1.5} />
          runtime.preview
        </div>
        <div className="mt-4 space-y-2 font-mono text-xs">
          {terminal.map(([command, result]) => (
            <CodeLine key={command} command={command} result={result} />
          ))}
        </div>
      </div>
      
    </div>
  );
}

function CodeLine({
  command,
  result,
  accent,
}: {
  command: string;
  result: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-white/30 bg-white/40 px-3 py-1.5 backdrop-blur-sm">
      <span className="min-w-0 truncate text-gray-700">
        <span className="text-primary font-bold">$</span> {command}
      </span>
      <span className={accent ? "text-primary font-medium" : "text-gray-800"}>{result}</span>
    </div>
  );
}

function PanelLabel({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-2 font-mono text-sm font-medium uppercase text-muted-foreground">
      <span className="text-primary">{icon}</span>
      {children}
    </div>
  );
}

function TeamBadge({
  code,
  name,
}: {
  code: string | null | undefined;
  name: string | null | undefined;
}) {
  return (
    <div className="flex items-center gap-2">
      <Flag code={code} size="md" />
      <div className="text-left">
        <div className="font-mono text-sm font-semibold leading-tight text-foreground">
          {code ?? "-"}
        </div>
        <div className="text-sm text-muted-foreground">{name ?? "-"}</div>
      </div>
    </div>
  );
}

function CountdownTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2">
      <div className="font-mono text-2xl font-bold tabular-nums text-foreground">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="animate-on-scroll rounded-lg border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="text-primary">{icon}</span>
        <span className="text-sm font-medium uppercase">{label}</span>
      </div>
      <div className="mt-3 font-mono text-4xl font-bold tabular-nums text-foreground">
        {value}
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getCounts() {
  const [teams, groups, matches, users] = await Promise.all([
    prisma.team.count(),
    prisma.group.count(),
    prisma.match.count(),
    prisma.user.count(),
  ]);
  return { teams, groups, matches, users };
}
