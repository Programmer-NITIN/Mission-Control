import Navbar from '@/components/layout/Navbar';

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-surface">
      <Navbar />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
