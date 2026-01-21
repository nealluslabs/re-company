'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type ViewMode = 'month' | 'week' | 'day';

type ShowingEvent = {
  id: string;
  title: string;
  time: string;
  address: string;
};

const demoEvents: ShowingEvent[] = [
  {
    id: '1',
    title: 'Showing • 2418 Maple St',
    time: '10:30 – 11:15',
    address: 'San Francisco, CA',
  },
  {
    id: '2',
    title: 'Showing • 884 Cedar Ave',
    time: '13:00 – 13:45',
    address: 'Oakland, CA',
  },
  {
    id: '3',
    title: 'Final Walkthrough • Lin Family',
    time: '16:00 – 17:00',
    address: 'San Mateo, CA',
  },
];

export default function ShowingsPage() {
  const [view, setView] = useState<ViewMode>('week');

  const openNewShowingModal = (slotLabel: string) => {
    // Placeholder for modal trigger
    console.log('Open New Showing modal for slot:', slotLabel);
  };

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-white">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Showings
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">
                <button
                  className="rounded-full px-2 py-0.5 text-xs hover:bg-white hover:text-black"
                  onClick={() => setView('month')}
                >
                  Month
                </button>
                <button
                  className="rounded-full bg-white px-2 py-0.5 text-xs text-black"
                  onClick={() => setView('week')}
                >
                  Week
                </button>
                <button
                  className="rounded-full px-2 py-0.5 text-xs hover:bg-white hover:text-black"
                  onClick={() => setView('day')}
                >
                  Day
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white hover:text-black">
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <section className="card-elevated flex-1 overflow-hidden">
            {/* Calendar header row (hours) */}
            <div className="flex border-b border-white/10 text-[11px] text-white/40">
              <div className="w-16 border-r border-white/10 px-2 py-2">Time</div>
              <div className="flex-1 px-2 py-2">Today</div>
            </div>

            {/* Time slots */}
            <div className="max-h-[600px] overflow-auto text-xs">
              {Array.from({ length: 10 }).map((_, idx) => {
                const hour = 9 + idx;
                const label = `${hour}:00`;
                const hasEvent = demoEvents.find((e) =>
                  e.time.startsWith(hour.toString()),
                );
                return (
                  <div
                    key={label}
                    className="flex border-b border-white/5"
                    onClick={() => openNewShowingModal(label)}
                  >
                    <div className="w-16 border-r border-white/10 px-2 py-3 text-[11px] text-white/40">
                      {label}
                    </div>
                    <div className="relative flex-1 px-2 py-2">
                      {hasEvent && (
                        <div className="rounded-lg border border-sky-400/40 bg-sky-500/10 px-2 py-1.5 text-[11px] text-sky-100">
                          <p className="text-[11px] font-medium text-sky-50">
                            {hasEvent.title}
                          </p>
                          <p className="text-[10px] text-sky-100/80">
                            {hasEvent.time} • {hasEvent.address}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}


