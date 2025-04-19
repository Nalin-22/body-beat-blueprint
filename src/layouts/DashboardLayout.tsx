
import { Outlet } from 'react-router-dom';
import SideMenu from '@/components/SideMenu';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideMenu />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
