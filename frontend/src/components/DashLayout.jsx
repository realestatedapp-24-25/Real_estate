import React, { useContext, useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UserCircle, ClipboardList, Heart, Building } from "lucide-react"; // Import Lucide icons
import { Toaster } from "react-hot-toast";

const DashLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
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
      <div
        className={`${
          isSidebarOpen ? "" : "hidden"
        } sm:block w-64 bg-mycol-dartmouth_green text-white flex-shrink-0`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
          <nav className="space-y-2">
            {/* Profile Link - For all users */}
            <NavLink
              to=""
              end
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-green-500/20 border border-green-500/30"
                    : "hover:bg-green-500/20"
                }`
              }
            >
              <UserCircle className="w-5 h-5" />
              <span>My Profile</span>
            </NavLink>

            {/* Donor Links */}
            {user.role === "donor" && (
              <>
                <NavLink
                  to="my-donations"
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-green-500/20 border border-green-500/30"
                        : "hover:bg-green-500/20"
                    }`
                  }
                >
                  <Heart className="w-5 h-5" />
                  <span>My Donations</span>
                </NavLink>
              </>
            )}

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
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="p-4 sm:hidden">
          <button
            className="text-mycol-dartmouth_green"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashLayout;