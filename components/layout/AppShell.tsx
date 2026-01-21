'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import LoginPage from '@/components/LoginPage';
import {
  Home,
  FolderKanban,
  CalendarDays,
  MapPin,
  Users,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/lib/firebase/auth';

type AppShellProps = {
  children: (user: FirebaseUser) => React.ReactNode;
};

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/vault', label: 'Vault', icon: FolderKanban },
  { href: '/showings', label: 'Showings', icon: CalendarDays },
  { href: '/location', label: 'Location', icon: MapPin },
  { href: '/clients', label: 'Clients', icon: Users },
];

export function AppShell({ children }: AppShellProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="h-2 w-2 animate-ping rounded-full bg-white" />
          <span>Preparing your workspace…</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-white/10 bg-[#050505]/95 backdrop-blur">
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-xs font-semibold tracking-tight">
            RE
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight">AgentOS</span>
            <span className="text-[11px] text-white/40">Real Estate Control Center</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-pill ${
                  active
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4 text-xs text-white/50">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[11px] font-medium uppercase">
                {user.displayName
                  ? user.displayName
                      .split(' ')
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join('')
                  : user.email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="text-[10px] text-white/40">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex h-7 items-center gap-1 rounded-full border border-white/10 px-2 text-[11px] text-white/60 hover:bg-white hover:text-black"
            >
              <LogOut className="h-3 w-3" />
              <span>Sign out</span>
            </button>
          </div>
          <div className="flex items-center justify-between pt-1 text-[10px] text-white/35">
            <span>Workspace</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
              Pro
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex min-h-screen flex-1 flex-col bg-black">
        <div className="flex-1 px-6 pb-8 pt-6 lg:px-10 lg:pt-8">
          {children(user)}
        </div>
      </main>
    </div>
  );
}

export default AppShell;


