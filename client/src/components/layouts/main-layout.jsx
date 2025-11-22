import React from "react";
import { Sidebar } from "../side-bar";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className="w-full flex h-screen">
      <Sidebar
        sideBarOpen={isSidebarOpen}
        onSidebarClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>
      {isSidebarOpen ? (
        <X
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md  shadow h-10 w-10 text-gray-600 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      ) : (
        <Menu
          className="absolute top-3 right-3 p-2 z-100 bg-white rounded-md  shadow h-10 w-10 text-gray-600 sm:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}
    </div>
  );
};
