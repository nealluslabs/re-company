'use client';

import { Suspense, useEffect, useMemo, useState } from 'react'; 
import { AppShell } from '@/components/layout/AppShell';
import { useSearchParams } from 'next/navigation';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { getShowing } from '@/lib/firebase/firestore';
import { Showing } from '@/lib/firebase/types';

// --- Types & Demo Data ---
type LocationAgent = {
  id: string;
  name: string;
  initials: string;
  lat: number;
  lng: number;
  showingId: string;
};

const demoAgents: LocationAgent[] = [
  { id: 'a1', name: 'You', initials: 'YU', lat: 6.4281, lng: 3.4219, showingId: 's1' },
  { id: 'a2', name: 'Sarah Lin', initials: 'SL', lat: 6.4460, lng: 3.4756, showingId: 's2' },
];

type ShowingFilter = {
  id: string;
  label: string;
};

let demoShowings: ShowingFilter[] = [
  { id: 'all', label: 'All Showings' },
  { id: 's1', label: '2418 Maple St • 10:30' },
  { id: 's2', label: '884 Cedar Ave • 13:00' },
];



// --- Map Styling Constants ---
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 6.4541,
  lng: 3.4356,
};

function MyLocationContent() {
  const searchParams = useSearchParams();
  const showingId = searchParams?.get('showing') || searchParams?.get('s') || '';

  const [chosenShowing,setChosenShowing] = useState<Showing>()

  // 1. Initialize the Google Maps loader
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const filteredAgents = useMemo(
    () => (showingId ? demoAgents.filter((a) => a.showingId === showingId) : demoAgents),
    [showingId],
  );



  const filteredShowings = useMemo(
    () => (showingId ? demoShowings.filter((a) => a.id === showingId) : demoShowings),
    [showingId],
  );

  useEffect(()=>{

    const loadShowing = async () => {
      try {
        const showingFound = await getShowing(showingId);
    
       if(showingFound){//so i cant set it outright based on the type, I have to check if it exists first
        setChosenShowing(showingFound);
       }

      } catch (error) {
        console.error('Error loading showings:', error);
      }
    };
    
    loadShowing();

  },[showingId])

  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">My Location</h1>
              <p className="mt-1 text-xs text-gray-500">
                View your shared location for the showing.
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {chosenShowing ? (
                <span>Showing: <span className="font-mono text-[11px] text-black">{chosenShowing && chosenShowing.address}</span></span>
              ) : (
                <span className="text-black-500 font-medium text-[11px]">Loading...{/*No showing specified in the URL*/}</span>
              )}
            </div>
          </header>

          <section className="card-elevated flex-1 overflow-hidden relative min-h-[400px]">
            {loadError ? (
              <div className="flex h-full items-center justify-center bg-red-50 text-red-500 text-xs">
                Error loading map. Please check your API key and restriction settings.
              </div>
            ) : isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={/*filteredAgents[0] ? { lat: filteredAgents[0].lat, lng: filteredAgents[0].lng } :*/ defaultCenter}
                zoom={14}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                  styles: [ // Optional: Minimalist map style
                    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                  ]
                }}
              >
                {filteredAgents.map((agent) => (
                  <MarkerF
                    key={agent.id}
                    position={{ lat: agent.lat, lng: agent.lng }}
                    label={{
                      text: agent.initials,
                      className: "bg-black text-white px-2 py-1 rounded text-[10px] font-bold border border-white"
                    }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 bg-gray-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
                <p className="text-[11px] text-gray-500">Syncing location...</p>
              </div>
            )}
          </section>
        </div>
      )}
    </AppShell>
  );
}

export default function MyLocationPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <div className="text-sm text-gray-500 animate-pulse">Initializing live view...</div>
      </div>
    }>
      <MyLocationContent />
    </Suspense>
  );
}