'use client';

import { AppShell } from '@/components/layout/AppShell';
import { ArrowRight } from 'lucide-react';

type ClientRow = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

const demoClients: ClientRow[] = [
  {
    id: '1',
    name: 'Sarah Lin',
    phone: '(415) 555-0192',
    email: 'sarah.lin@example.com',
  },
  {
    id: '2',
    name: 'Acme Relocation Group',
    phone: '(510) 555-4832',
    email: 'hr@acmerelocation.com',
  },
  {
    id: '3',
    name: 'Daniel Park',
    phone: '(650) 555-2024',
    email: 'daniel.park@example.com',
  },
];

export default function ClientsPage() {
  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-white">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Clients
              </h1>
              <p className="mt-1 text-xs text-white/45">
                CRM view of your active buyers, sellers, and relocation partners.
              </p>
            </div>
          </header>

          <section className="card-elevated flex-1 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-2 text-[11px] text-white/40">
              <div className="grid grid-cols-[minmax(0,2fr)_140px_minmax(0,2fr)_80px] gap-3">
                <span>Client Name</span>
                <span>Phone</span>
                <span>Email</span>
                <span className="text-right">Actions</span>
              </div>
            </div>
            <div className="max-h-[540px] overflow-auto text-xs">
              {demoClients.map((client) => (
                <div
                  key={client.id}
                  className="border-b border-white/5 px-4 py-2.5 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <div className="grid grid-cols-[minmax(0,2fr)_140px_minmax(0,2fr)_80px] items-center gap-3">
                    <span className="text-[12px] text-white">{client.name}</span>
                    <span className="text-[11px] text-white/60">
                      {client.phone}
                    </span>
                    <span className="truncate text-[11px] text-white/60">
                      {client.email}
                    </span>
                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/80 hover:bg-white hover:text-black">
                        View
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </AppShell>
  );
}


