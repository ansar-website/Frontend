import Link from 'next/link';
import DashboardLayout from '../../layouts/Dasboard/DashboardLayout';

function Dashboard() {
  return (
    <div>
      <h1 className="f_100">index</h1>
      <Link href="/dashboard/profile">profile</Link>
    </div>
  );
}
export default Dashboard;
Dashboard.Layout = DashboardLayout;
