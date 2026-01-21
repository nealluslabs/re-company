'use client';

import { AppShell } from '@/components/layout/AppShell';
import { Plus, Search, Folder, FileText } from 'lucide-react';

type VaultItem = {
  name: string;
  modified: string;
  size: string;
  status: 'Active' | 'Signed' | 'Draft';
  type: 'folder' | 'file';
};

const demoItems: VaultItem[] = [
  {
    name: 'Active Listings',
    modified: 'Updated 2h ago',
    size: '—',
    status: 'Active',
    type: 'folder',
  },
  {
    name: 'Contracts',
    modified: 'Updated yesterday',
    size: '—',
    status: 'Active',
    type: 'folder',
  },
  {
    name: '2418 Maple St - Listing Agreement.pdf',
    modified: '2h ago',
    size: '1.8 MB',
    status: 'Signed',
    type: 'file',
  },
  {
    name: 'Lin Family - Buyer Rep Agreement.pdf',
    modified: 'Yesterday',
    size: '940 KB',
    status: 'Draft',
    type: 'file',
  },
];

export default function VaultPage() {
  return (
    <AppShell>
      {() => (
        <div className="flex h-full flex-col text-white">
          <header className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white">
                Vault
              </h1>
              <p className="mt-1 text-xs text-white/45">
                Centralized storage for listings, contracts, and disclosure packets.
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white text-xs font-medium text-black px-3 py-1.5 hover:bg-white/90">
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </header>

          <div className="card-elevated mb-4 flex items-center gap-2 px-3 py-2.5">
            <Search className="h-3.5 w-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search files and folders"
              className="h-7 flex-1 bg-transparent text-xs text-white placeholder:text-white/35 focus:outline-none"
            />
          </div>

          <section className="card-elevated flex-1 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-2 text-[11px] text-white/40">
              <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_80px_90px] gap-3">
                <span>Name</span>
                <span>Date Modified</span>
                <span className="text-right">Size</span>
                <span className="text-right">Status</span>
              </div>
            </div>
            <div className="max-h-[520px] overflow-auto text-xs">
              {demoItems.map((item) => (
                <div
                  key={item.name}
                  className="border-b border-white/5 px-4 py-2.5 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_80px_90px] items-center gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                        {item.type === 'folder' ? (
                          <Folder className="h-3.5 w-3.5 text-white/80" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-white/80" />
                        )}
                      </div>
                      <span className="truncate text-[12px] text-white">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-white/45">
                      {item.modified}
                    </span>
                    <span className="text-right text-[11px] text-white/45">
                      {item.size}
                    </span>
                    <div className="flex justify-end">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                          item.status === 'Signed'
                            ? 'border border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                            : item.status === 'Draft'
                            ? 'border border-white/15 bg-white/5 text-white/70'
                            : 'border border-sky-400/40 bg-sky-500/10 text-sky-200'
                        }`}
                      >
                        {item.status}
                      </span>
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


