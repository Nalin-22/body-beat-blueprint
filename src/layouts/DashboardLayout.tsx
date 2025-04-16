import { Outlet } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';
import { cn } from '@/lib/utils';
import { useState } from 'react';
const DashboardLayout = () => {
  const [isSidebarOpen] = useState(true);
  return <div className="flex min-h-screen bg-gray-50">
      <SideMenu />
      <main className={cn("flex-1 transition-all duration-300", isSidebarOpen ? "md:ml-64" : "md:ml-20")}>
        <div className="container px-4 py-2">
          <Outlet />
        </div>
      </main>
    </div>;
};
export default DashboardLayout;