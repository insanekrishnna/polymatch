import Link from "next/link";
import {
  ArrowRight,
  Braces,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
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
import type { ReactNode } from "react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { buttonVariants } from "@/components/ui/button";
import { Countdown } from "@/components/countdown";
import { ComputeOrbScene } from "@/components/compute-orb-scene";
import { Flag } from "@/components/flag";

const PROOF_ITEMS = [
  "Private league runtime",
  "104 fixture pipeline",
  "48-team state graph",
  "Live scoring workers",
];

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

export default async function HomePage() {
  const [user, firstMatch, counts] = await Promise.all([
    getCurrentUser(),
    prisma.match.findFirst({
      orderBy: { date: "asc" },
      include: { homeTeam: true, awayTeam: true },
    }),
    getCounts(),
  ]);

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

      <section className="border-b border-border py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="animate-on-scroll grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PROOF_ITEMS.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            eyebrow="Workloads"
            title="Designed for the full prediction lifecycle."
            body="The interface treats a World Cup pool like an operating system: inputs, state, rankings and reviews all stay close together."
          />
          <div className="mt-12 space-y-8">
            {FEATURE_ROWS.map((feature) => (
              <FeatureRow key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <div className="gradient-line" />

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionIntro
            eyebrow="Infrastructure"
            title="A premium shell around the tournament tools users need."
            body="Every surface is quiet, dark and dense enough for repeated use, with green reserved for action, status and active highlights."
          />
          <div className="animate-on-scroll animate-stagger mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="rounded-lg border border-border bg-card p-6 transition-colors duration-200 hover:border-[var(--border-hover)] hover:bg-secondary"
                >
                  <div className="grid size-10 place-items-center rounded-lg border border-primary/25 bg-transparent text-primary">
                    <Icon className="size-5" strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
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
      <div className="rounded-xl border border-white/50 bg-white/30 p-5 backdrop-blur-2xl shadow-sm">
        <div className="flex items-center gap-2 border-b border-white/20 pb-4 font-mono text-sm text-muted-foreground">
          <Icon className="size-4 text-primary" strokeWidth={1.5} />
          runtime.preview
        </div>
        <div className="mt-5 space-y-3 font-mono text-sm">
          {terminal.map(([command, result]) => (
            <CodeLine key={command} command={command} result={result} />
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-white/50 bg-white/30 p-6 backdrop-blur-2xl shadow-sm">
        <div className="section-eyebrow text-gray-700">{eyebrow}</div>
        <h3 className="mt-5 text-3xl font-semibold leading-tight text-gray-900">{title}</h3>
        <p className="mt-5 text-base leading-7 text-gray-800">{body}</p>
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
    <div className="flex items-center justify-between gap-4 rounded-md border border-white/30 bg-white/40 px-3 py-2 backdrop-blur-sm">
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
