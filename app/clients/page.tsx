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
        <div className="flex h-full flex-col text-black">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-black">
                Clients
              </h1>
              <p className="mt-1 text-xs text-gray-500">
                CRM view of your active buyers, sellers, and relocation partners.
              </p>
            </div>
          </header>

          <section className="card-elevated flex-1 overflow-hidden">
            <div className="border-b border-gray-200 px-4 py-2 text-[11px] text-gray-500">
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
                  className="border-b border-gray-200 px-4 py-2.5 last:border-b-0 hover:bg-gray-50"
                >
                  <div className="grid grid-cols-[minmax(0,2fr)_140px_minmax(0,2fr)_80px] items-center gap-3">
                    <span className="text-[12px] text-black">{client.name}</span>
                    <span className="text-[11px] text-gray-600">
                      {client.phone}
                    </span>
                    <span className="truncate text-[11px] text-gray-600">
                      {client.email}
                    </span>
                    <div className="flex justify-end">
                      <button className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-black px-2 py-1 text-[11px] text-white hover:bg-black/90">
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


