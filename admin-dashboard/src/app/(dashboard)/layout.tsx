import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-slate-700">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="p-6 flex-1 overflow-auto bg-gray-50 dark:bg-slate-700">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}