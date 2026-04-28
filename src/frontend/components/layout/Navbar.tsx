'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/frontend/context/AuthContext';
import { isFirebaseConfigured } from '@/backend/config/firebase';
import { isGeminiConfigured } from '@/backend/services/gemini';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { label: 'Map', href: '/map', icon: 'map' },
  { label: 'Reports', href: '/reports', icon: 'description' },
  { label: 'Volunteers', href: '/volunteers', icon: 'group' },
  { label: 'Assignments', href: '/assignments', icon: 'assignment_ind' },
  { label: 'Analytics', href: '/analytics', icon: 'analytics' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isDemo, signInWithGoogle, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between px-8 h-[72px] w-full max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center text-on-primary transition-transform group-hover:scale-105">
            <span className="material-symbols-outlined text-[20px]">public</span>
          </div>
          <span className="text-xl font-black tracking-tight text-on-surface">
            Mission Control
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center gap-1 h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 h-full flex items-center text-sm font-medium transition-colors relative ${
                  isActive
                    ? 'text-primary-container font-bold'
                    : 'text-outline hover:text-primary-container'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-primary-container rounded-t-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Status indicators */}
          <div className="hidden xl:flex items-center gap-1.5 mr-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isFirebaseConfigured ? 'bg-mc-secondary' : 'bg-outline'}`} />
            <span className="text-[10px] text-outline font-medium">DB</span>
            <div className={`w-1.5 h-1.5 rounded-full ml-1 ${isGeminiConfigured ? 'bg-mc-secondary' : 'bg-outline'}`} />
            <span className="text-[10px] text-outline font-medium">AI</span>
          </div>

          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 rounded-full border border-outline-variant bg-surface-container-low text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent w-56 transition-all placeholder:text-outline"
            />
          </div>
          <button className="p-2.5 rounded-full hover:bg-surface-container transition-colors relative group">
            <span className="material-symbols-outlined text-outline group-hover:text-primary-container text-[22px]">
              notifications
            </span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-mc-error rounded-full" />
          </button>
          <button className="p-2.5 rounded-full hover:bg-surface-container transition-colors group">
            <span className="material-symbols-outlined text-outline group-hover:text-primary-container text-[22px]">
              apps
            </span>
          </button>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={signOut}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container transition-colors group"
              title={user.displayName || 'Sign out'}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border-2 border-primary-container" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-sm font-bold">
                  {(user.displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}
            </button>
          ) : isDemo ? (
            <button className="p-2.5 rounded-full hover:bg-surface-container transition-colors group">
              <span className="material-symbols-outlined text-outline group-hover:text-primary-container text-[22px]">
                account_circle
              </span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="btn-primary text-xs py-2 px-3"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
