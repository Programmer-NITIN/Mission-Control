import Navbar from '@/components/layout/Navbar';
export default function AssignmentsLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col min-h-screen bg-surface"><Navbar /><main className="flex-1">{children}</main></div>;
}
