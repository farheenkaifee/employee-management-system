
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const emptyForm = {
  employeeId: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  department: "",
  designation: "",
};

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
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
      const response = await api.get("/employees");
      setEmployees(response.data.employees || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load employees. Please check your login and permissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const openEditForm = (employee) => {
    setForm({
      employeeId: employee.employeeId || "",
      firstName: employee.firstName || "",
      lastName: employee.lastName || "",
      email: employee.email || "",
      password: "",
      phone: employee.phone || "",
      department: employee.department || "",
      designation: employee.designation || "",
    });

    setEditingId(employee._id);
    setShowForm(true);
    setError("");
    setNotice("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        employeeId: form.employeeId.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        department: form.department.trim(),
        designation: form.designation.trim(),
      };

      if (editingId) {
        await api.put(`/employees/${editingId}`, payload);
        setNotice("Employee updated successfully.");
      } else {
        await api.post("/employees", {
          ...payload,
          password: form.password,
        });
        setNotice("Employee and login account created successfully.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to save employee. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate ${employee.firstName} ${employee.lastName}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await api.delete(`/employees/${employee._id}`);
      setNotice("Employee deactivated successfully.");
      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to deactivate employee."
      );
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const query = search.toLowerCase().trim();

    const values = [
      employee.firstName,
      employee.lastName,
      employee.email,
      employee.employeeId,
      employee.department,
      employee.designation,
    ];

    return values.some((value) =>
      String(value || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="employees-page">
      <div className="employees-heading">
        <div>
          <h1>Employees</h1>
          <p>Manage employee records and accounts.</p>
        </div>

        <button
          className="employee-primary-btn"
          onClick={openAddForm}
        >
          + Add Employee
        </button>
      </div>

      {error && (
        <div className="employee-alert employee-alert-error">
          {error}
        </div>
      )}

      {notice && (
        <div className="employee-alert employee-alert-success">
          {notice}
        </div>
      )}

      <div className="employees-toolbar">
        <input
          type="search"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span>{filteredEmployees.length} employee(s)</span>
      </div>

      {showForm && (
        <div className="employee-form-card">
          <h2>{editingId ? "Edit Employee" : "Add Employee"}</h2>

          <form onSubmit={handleSubmit} className="employee-form">
            <label>
              Employee ID *
              <input
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                required
                disabled={Boolean(editingId)}
              />
            </label>

            <label>
              First Name *
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Last Name *
              <input
                name="lastName"
                value={form.lastName}
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

            {!editingId && (
              <label>
                Initial Password *
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </label>
            )}

            <label>
              Phone
              <input
                name="phone"
                type="tel"
                value={form.phone}
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

            <div className="employee-form-actions">
              <button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Employee"
                  : "Save Employee"}
              </button>

              <button
                type="button"
                className="employee-secondary-btn"
                onClick={() => {
                  setShowForm(false);
                  setForm(emptyForm);
                  setEditingId(null);
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
            No employee records found.
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <strong>
                        {employee.firstName} {employee.lastName}
                      </strong>
                      <small>{employee.email}</small>
                    </td>

                    <td>{employee.employeeId}</td>
                    <td>{employee.department || "—"}</td>
                    <td>{employee.designation || "—"}</td>
                    <td>{employee.phone || "—"}</td>
                    <td>{employee.employmentStatus || "Active"}</td>

                    <td>
                      <div className="employee-row-actions">
                        <button
                          onClick={() => openEditForm(employee)}
                        >
                          Edit
                        </button>

                        <button
                          className="employee-delete-btn"
                          onClick={() => handleDelete(employee)}
                          disabled={employee.employmentStatus === "Inactive"}
                        >
                          Deactivate
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
