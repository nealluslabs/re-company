'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ArrowUpRight, FileText, Users, CalendarDays } from 'lucide-react';

const showingsSummary = {
  today: 3,
  week: 9,
  upcoming: [
    { time: '10:30 AM', address: '2418 Maple St, San Francisco', client: 'Sarah Lin' },
    { time: '1:00 PM', address: '884 Cedar Ave, Oakland', client: 'Acme Relocation' },
  ],
};

const clientsSummary = {
  active: 12,
  hot: 4,
  stageBreakdown: [
    { label: 'New Lead', value: 6 },
    { label: 'Touring', value: 4 },
    { label: 'Offer Out', value: 2 },
  ],
};

const recentFiles = [
  { name: '2418 Maple St - Listing Agreement.pdf', status: 'Signed', updated: '2h ago' },
  { name: 'Lin Family - Buyer Rep Agreement.pdf', status: 'Awaiting Signature', updated: 'Yesterday' },
  { name: 'Oakland Relocation Packet.pdf', status: 'In Review', updated: '2 days ago' },
];

const pipeline = [
  { label: 'Prospecting', value: 68 },
  { label: 'Active Buyers', value: 54 },
  { label: 'Under Contract', value: 32 },
  { label: 'Closed (30d)', value: 18 },
];

export default function DashboardPage() {
  return (
    <AppShell>
      {(user) => (
        <div className="space-y-6 text-white">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Morning, {user.displayName || user.email?.split('@')[0]}
              </h1>
              <p className="mt-1 text-xs text-white/45">
                High-level overview of your showings, clients, and deal flow.
              </p>
            </div>
            <div className="hidden items-center gap-3 text-xs text-white/50 sm:flex">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live location tracking enabled
              </span>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-2 lg:grid-rows-2">
            {/* Showings Card */}
            <div className="card-elevated flex flex-col justify-between p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Showings
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{showingsSummary.today}</span>
                    <span className="text-xs text-white/40">today</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    {showingsSummary.week} scheduled this week
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <CalendarDays className="h-4 w-4 text-white/80" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {showingsSummary.upcoming.map((item) => (
                  <div
                    key={item.time + item.address}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <div>
                      <p className="text-xs text-white/60">{item.time}</p>
                      <p className="text-xs font-medium text-white">{item.address}</p>
                      <p className="text-[11px] text-white/40">Client • {item.client}</p>
                    </div>
                    <button className="inline-flex h-7 items-center gap-1 rounded-full border border-white/10 px-2 text-[11px] text-white/65 hover:bg-white hover:text-black">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Clients Card */}
            <div className="card-elevated flex flex-col justify-between p-4 md:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Clients
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{clientsSummary.active}</span>
                    <span className="text-xs text-white/40">active</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    {clientsSummary.hot} in hot pipeline
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <Users className="h-4 w-4 text-white/80" />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {clientsSummary.stageBreakdown.map((stage) => (
                  <div key={stage.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span>{stage.label}</span>
                      <span>{stage.value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${Math.min(stage.value, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Files Card */}
            <div className="card-elevated flex flex-col p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Recent Files
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">
                    From your Vault workspace
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <FileText className="h-4 w-4 text-white/80" />
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {recentFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[12px] text-white">{file.name}</p>
                      <p className="mt-0.5 text-[11px] text-white/40">
                        {file.status} · Updated {file.updated}
                      </p>
                    </div>
                    <button className="inline-flex h-7 items-center gap-1 rounded-full border border-white/10 px-2 text-[11px] text-white/65 hover:bg-white hover:text-black">
                      Open
                      <ArrowUpRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Pipeline Card */}
            <div className="card-elevated flex flex-col p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                    Active Pipeline
                  </p>
                  <p className="mt-1 text-[11px] text-white/40">
                    Conversion by stage (last 30 days)
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5">
                  <ArrowUpRight className="h-4 w-4 text-emerald-300" />
                </div>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-3 text-xs">
                {pipeline.map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col justify-between rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
                  >
                    <div>
                      <p className="text-[11px] text-white/45">{item.label}</p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {item.value}%
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}


