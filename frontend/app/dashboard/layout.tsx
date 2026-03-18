'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  return (
    <div className="dashboard-wrap">
      <Sidebar />
      <main className="dashboard-main">
        {children}
      </main>
    </div>
  );
}
