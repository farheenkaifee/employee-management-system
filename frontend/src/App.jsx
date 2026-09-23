import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Employees from "./pages/Employees";
// import Documents from "./pages/Documents";
// import Leaves from "./pages/Leaves";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />

        {/* <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/employees"
          element={token ? <Employees /> : <Navigate to="/login" />}
        />

        <Route
          path="/documents"
          element={token ? <Documents /> : <Navigate to="/login" />}
        />

        <Route
          path="/leaves"
          element={token ? <Leaves /> : <Navigate to="/login" />}
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;