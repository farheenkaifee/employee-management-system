
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  name: "",
  email: "",
  employeeId: "",
  department: "",
  designation: "",
  phone: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Adjust this URL if your backend uses a different route.
      const response = await api.get("/employees");
      const data = response.data;

      setEmployees(
        Array.isArray(data)
          ? data
          : data.employees || data.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load employees. Check your backend API route."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const openEditForm = (employee) => {
    setForm({
      name: employee.name || "",
      email: employee.email || "",
      employeeId: employee.employeeId || "",
      department: employee.department || "",
      designation: employee.designation || "",
      phone: employee.phone || "",
    });

    setEditingId(employee._id);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
        setNotice("Employee updated successfully.");
      } else {
        await api.post("/employees", form);
        setNotice("Employee added successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save employee. Check your API route and required fields."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await api.delete(`/employees/${employee._id}`);
      setNotice("Employee deleted successfully.");
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete employee. Check your permissions and API route."
      );
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase();

    return [
      employee.name,
      employee.email,
      employee.employeeId,
      employee.department,
      employee.designation,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="employees-page">
      <div className="employees-heading">
        <div>
          <h1>Employees</h1>
          <p>Manage your organization's employee records.</p>
        </div>

        <button className="employee-primary-btn" onClick={openAddForm}>
          + Add Employee
        </button>
      </div>

      {error && <div className="employee-alert employee-alert-error">{error}</div>}
      {notice && <div className="employee-alert employee-alert-success">{notice}</div>}

      <div className="employees-toolbar">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, ID or department..."
          aria-label="Search employees"
        />

        <span>{filteredEmployees.length} employee(s)</span>
      </div>

      {showForm && (
        <div className="employee-form-card">
          <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

          <form onSubmit={handleSubmit} className="employee-form">
            <label>
              Full Name *
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Email *
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Employee ID
              <input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
              />
            </label>

            <label>
              Department
              <input
                name="department"
                value={form.department}
                onChange={handleChange}
              />
            </label>

            <label>
              Designation
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </label>

            <div className="employee-form-actions">
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Update Employee" : "Save Employee"}
              </button>

              <button
                type="button"
                className="employee-secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="employee-table-card">
        {loading ? (
          <p className="employee-empty">Loading employees...</p>
        ) : filteredEmployees.length === 0 ? (
          <p className="employee-empty">
            {error ? "Employee records could not be loaded." : "No employees found."}
          </p>
        ) : (
          <div className="employee-table-scroll">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <strong>{employee.name}</strong>
                      <small>{employee.email}</small>
                    </td>
                    <td>{employee.employeeId || "—"}</td>
                    <td>{employee.department || "—"}</td>
                    <td>{employee.designation || "—"}</td>
                    <td>{employee.phone || "—"}</td>
                    <td>
                      <div className="employee-row-actions">
                        <button onClick={() => openEditForm(employee)}>
                          Edit
                        </button>
                        <button
                          className="employee-delete-btn"
                          onClick={() => handleDelete(employee)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
