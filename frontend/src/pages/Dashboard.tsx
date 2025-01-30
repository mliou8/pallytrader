import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex h-screen text-white">
      <Sidebar />

      {/* Main content area where routes will change dynamically */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet /> {/* This renders the nested routes */}
      </main>
    </div>
  );
};

export default Dashboard;
