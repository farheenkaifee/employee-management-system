import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Files,
  CalendarDays,
  LogOut,
  UserRound,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", path: "/employees", icon: Users },
  { label: "Documents", path: "/documents", icon: Files },
  { label: "Leave Management", path: "/leaves", icon: CalendarDays },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <UserRound size={22} />
        </div>
        <div>
          <h2>PeopleDesk</h2>
          <span>Management Portal</span>
        </div>
      </div>

      <span className="menu-heading">WORKSPACE</span>

      <nav className="sidebar-nav">
        {menuItems.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="avatar">
            {(user.name || "U").charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <strong>{user.name || "User"}</strong>
            <span>{user.role || "Employee"}</span>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}