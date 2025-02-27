import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserCircle, ClipboardList, Heart, Building } from "lucide-react"; // Import Lucide icons
import { Toaster } from "react-hot-toast";
import { FiPackage, FiGift, FiUser, FiLogOut } from "react-icons/fi";

const DashLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Toaster
        toastOptions={{
          duration: 3000,
          style: {
            padding: "16px",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        }}
      />
      <div className="w-full md:w-64 bg-white shadow-md">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-mycol-mint flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="font-medium">{user?.name || "User"}</h3>
              <p className="text-xs text-gray-500 capitalize">{user?.role || "User"}</p>
            </div>
          </div>

          <nav className="space-y-2">
            {/* Profile Link - Always visible */}
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-500/20 border border-green-500/30"
                    : "hover:bg-green-500/20"
                }`
              }
              end
            >
              <FiUser className="w-5 h-5" />
              <span>Profile</span>
            </NavLink>

            {/* Institute Links */}
            {user.role === "institute" && (
              <>
                <NavLink
                  to="my-requests"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-500/20 border border-green-500/30"
                        : "hover:bg-green-500/20"
                    }`
                  }
                >
                  <Building className="w-5 h-5" />
                  <span>My Requests</span>
                </NavLink>
              </>
            )}

            {/* General User Links */}
            {user.role === "user" && (
              <>
                <NavLink
                  to="my-activities"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-500/20 border border-green-500/30"
                        : "hover:bg-green-500/20"
                    }`
                  }
                >
                  <ClipboardList className="w-5 h-5" />
                  <span>My Activities</span>
                </NavLink>
              </>
            )}

            {/* Requests Link */}
            <NavLink
              to="/profile/requests"
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-500/20 border border-green-500/30"
                    : "hover:bg-green-500/20"
                }`
              }
            >
              <FiPackage className="w-5 h-5" />
              <span>Requests</span>
            </NavLink>

            {/* Donations Link - Visible to donors only */}
            {user.role === "donor" && (
              <NavLink
                to="/profile/my-donations"
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-500/20 border border-green-500/30"
                      : "hover:bg-green-500/20"
                  }`
                }
              >
                <FiGift className="w-5 h-5" />
                <span>My Donations</span>
              </NavLink>
            )}

            {/* Logout Button */}
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashLayout;