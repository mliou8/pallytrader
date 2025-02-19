import { Link } from "react-router-dom";
import {
  AppWindow,
  Calendar,
  Wallet,
  UserRoundPlus,
  UserRound,
} from "lucide-react";
import Pally from "../assets/Pally.png";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#161617] p-6 text-white h-screen border-r border-[#333333]">
      {/* User Profile Section */}
      <div className="flex items-center space-x-3 mb-8">
        <img src={Pally} alt="Logo" className="h-20 w-auto" />
      </div>

      {/* Sidebar Navigation */}
      <nav className="mt-6 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          <AppWindow size={20} className="mr-3 text-[#BB86FC]" />
          <span className="text-sm font-medium">AI Trader</span>
        </Link>
        {/* <Link
          to="/dashboard/pallyreports"
          className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          <Calendar size={20} className="mr-3 text-[#03DAC6]" />
          <span className="text-sm font-medium">Get Insights</span>
        </Link> */}
        <Link
          to="/dashboard/profile"
          className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          <UserRound size={20} className="mr-3 text-[#6200EE]" />
          <span className="text-sm font-medium">Profile</span>
        </Link>
        <Link
          to="/dashboard/trackwallets"
          className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          <Wallet size={20} className="mr-3 text-[#FFA726]" />
          <span className="text-sm font-medium">Settings</span>
        </Link>

        {/* <Link
          to="/dashboard/referrals"
          className="flex items-center p-3 rounded-lg hover:bg-[#333333] transition-colors duration-200"
        >
          <UserRoundPlus size={20} className="mr-3 text-[#00BFA5]" />
          <span className="text-sm font-medium">Referrals</span>
        </Link> */}
      </nav>

      {/* Footer Section (Optional) */}
      <div className="mt-8 pt-4 border-t border-[#333333]">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Pally. All rights reserved.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
