'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

type LocationAgent = {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  showingId: string;
};

const demoAgents: LocationAgent[] = [
  {
    id: 'a1',
    name: 'You',
    initials: 'YU',
    lat: 37.7749,
    lng: -122.4194,
    showingId: 's1',
  },
  {
    id: 'a2',
    name: 'Sarah Lin',
    initials: 'SL',
    lat: 37.7849,
    lng: -122.4094,
    showingId: 's2',
  },
];

export default function MyLocationPage() {
  const searchParams = useSearchParams();
  const showingId = searchParams?.get('showing') || searchParams?.get('s') || '';

  const filteredAgents = useMemo(
    () => (showingId ? demoAgents.filter((a) => a.showingId === showingId) : demoAgents),
    [showingId],
  );

  const hasMapsKey = !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">My Location</h1>
              <p className="mt-1 text-xs text-gray-500">
                View your shared location for the showing. This page expects a showing id in the link (e.g. <span className="font-mono text-[10px]">?showing=s1</span>).
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {showingId ? (
                <span>Showing: <span className="font-mono text-[11px] text-black">{showingId}</span></span>
              ) : (
                <span className="text-red-500">No showing specified in the URL</span>
              )}
            </div>
          </header>

          {/* Map area (no invite, no dropdown) */}
          <section className="card-elevated flex-1 overflow-hidden">
            {hasMapsKey ? (
              <div className="h-full w-full">
                {/* TODO: Replace with real map (GoogleMap/Mapbox) wired to filteredAgents */}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-white">
                <div className="h-40 w-40 rounded-full border border-dashed border-gray-300 bg-gradient-to-br from-gray-100 to-transparent" />
                <div className="text-center text-xs text-gray-600">
                  <p className="font-medium text-black">Map not configured</p>
                  <p className="mt-1 text-[11px] text-gray-500">
                    Add <span className="font-mono text-[10px] text-black">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</span> to render live agent locations.
                  </p>
                  <div className="mt-3 flex justify-center gap-2 text-[11px] text-gray-600">
                    {filteredAgents.map((agent) => (
                      <span key={agent.id} className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-black">{agent.initials}</span>
                        <span>{agent.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}