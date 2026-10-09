
import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-area">
        <header className="topbar">
          <div>
            <span className="topbar-label">PEOPLEDESK</span>
            <span className="topbar-subtitle">
              Employee Management System
            </span>
          </div>

          <div className="topbar-user">
            <button
              className="icon-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>
            <span>{user.name || "User"}</span>
          </div>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}