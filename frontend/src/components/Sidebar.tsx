import { Link } from "react-router-dom";
import { AppWindow, Calendar, Wallet, UserRoundPlus, UserRound } from "lucide-react";
import Pally from "../assets/Pally.png";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#1E293B] p-6 text-white h-screen">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3">
        <img src={Pally} alt="Logo" className="h-30 w-auto" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-6 space-y-2">
        <Link to="/dashboard" className="flex items-center p-2 rounded hover:bg-gray-700">
          <AppWindow size={18} className="mr-3" /> My Positions
        </Link>
        <Link to="/dashboard/pallyreports" className="flex items-center p-2 rounded hover:bg-gray-700">
          <Calendar size={18} className="mr-3" /> Pally Reports
        </Link>
        <Link to="/dashboard/trackwallets" className="flex items-center p-2 rounded hover:bg-gray-700">
          <Wallet size={18} className="mr-3" /> Track Wallets
        </Link>
        <Link to="/dashboard/profile" className="flex items-center p-2 rounded hover:bg-gray-700">
          <UserRound size={18} className="mr-3" /> Profile
        </Link>
        <Link to="/dashboard/referrals" className="flex items-center p-2 rounded hover:bg-gray-700">
          <UserRoundPlus size={18} className="mr-3" /> Referrals
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
