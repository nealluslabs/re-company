'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useMemo, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

// --- Types & Demo Data ---
type LocationAgent = {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  showingId: string;
};

type ShowingFilter = {
  id: string;
  label: string;
};

const demoShowings: ShowingFilter[] = [
  { id: 'all', label: 'All Showings' },
  { id: 's1', label: '2418 Maple St • 10:30' },
  { id: 's2', label: '884 Cedar Ave • 13:00' },
];

const demoAgents: LocationAgent[] = [
  { id: 'a1', name: 'You', initials: 'YU', lat: 6.4281, lng: 3.4219, showingId: 's1' },
  { id: 'a2', name: 'Sarah Lin', initials: 'SL', lat: 6.4460, lng: 3.4756, showingId: 's2' },
];

// --- Map Constants ---
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 6.4541,
  lng: 3.4356,
};

export default function LocationPage() {
  const [filter, setFilter] = useState<string>('all');
  const [inviteEmail, setInviteEmail] = useState('');

  // 1. Load the Google Maps Script using your Public Key
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const filteredAgents = useMemo(
    () =>
      filter === 'all'
        ? demoAgents
        : demoAgents.filter((agent) => agent.showingId === filter),
    [filter],
  );

  const handleInvite = () => {
    if (!inviteEmail) return;
    console.log('Send invite to:', inviteEmail);
    setInviteEmail('');
  };

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">Live Location</h1>
              <p className="mt-1 text-xs text-gray-500">
                Track agents in the field and share secure location links.
              </p>
            </div>
            
            <div className="flex w-full max-w-md items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1.5">
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Invite agent by email"
                className="h-7 flex-1 bg-transparent text-xs text-black placeholder:text-gray-400 focus:outline-none"
              />
              <button
                onClick={handleInvite}
                className="inline-flex h-7 items-center rounded-full bg-black px-3 text-[11px] font-medium text-white hover:bg-black/90"
              >
                Send Invite
              </button>
            </div>
          </header>

          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-gray-600">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2 py-1">
              <span className="text-[11px] text-gray-500">Showing</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-transparent text-xs text-black focus:outline-none"
              >
                {demoShowings.map((s) => (
                  <option key={s.id} value={s.id} className="text-black">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-[11px] text-gray-500">
              {filteredAgents.length} active agent{filteredAgents.length === 1 ? '' : 's'}
            </span>
          </div>

          {/* Map Area */}
          <section className="card-elevated flex-1 overflow-hidden relative min-h-[400px]">
            {loadError ? (
              <div className="flex h-full items-center justify-center bg-red-50 text-red-500">
                Error loading maps. Check your API key.
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={13}
                options={{
                  disableDefaultUI: true, // Clean look
                  zoomControl: true,
                }}
              >
                {/* Dynamically render markers for filtered agents */}
                {filteredAgents.map((agent) => (
                  <MarkerF
                    key={agent.id}
                    position={{ lat: agent.lat, lng: agent.lng }}
                    label={{
                      text: agent.initials,
                      className: "bg-white px-2 py-1 rounded shadow-sm text-[10px] font-bold"
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              /* This shows while the Google script is downloading */
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <p className="text-xs text-gray-500">Loading live map...</p>
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}