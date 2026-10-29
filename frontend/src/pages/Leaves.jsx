
import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  leaveType: "Casual Leave",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function Leaves() {
  const [leaves, setLeaves] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = String(user.role || "").toLowerCase();
  const isAdmin = role === "admin" || role === "hr manager";

  const loadLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/leaves");
      const data = response.data;

      setLeaves(
        Array.isArray(data) ? data : data.leaves || data.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load leave requests. Check your backend API."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeaves();
  }, [loadLeaves]);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const submitLeave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (form.endDate < form.startDate) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/leaves", form);
      setMessage("Leave request submitted successfully.");
      setForm(initialForm);
      await loadLeaves();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit leave request. Check your backend API."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (leaveId, status) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/leaves/${leaveId}/status`, { status });
      setMessage(`Leave request ${status.toLowerCase()} successfully.`);
      await loadLeaves();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update leave status. Check your permissions and API."
      );
    }
  };

  const filteredLeaves = leaves.filter((leave) => {
    const query = search.toLowerCase();

    return [
      leave.employee?.name,
      leave.employeeName,
      leave.leaveType,
      leave.reason,
      leave.status,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  const getDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString();
  };

  return (
    <div className="leaves-page">
      <div className="leaves-heading">
        <div>
          <h1>Leave Management</h1>
          <p>Apply for leave and track requests.</p>
        </div>
      </div>

      {error && <div className="leave-alert leave-error">{error}</div>}
      {message && <div className="leave-alert leave-success">{message}</div>}

      {!isAdmin && (
        <section className="leave-card">
          <h2>Apply for Leave</h2>

          <form className="leave-form" onSubmit={submitLeave}>
            <label>
              Leave Type
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                required
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
                <option>Unpaid Leave</option>
              </select>
            </label>

            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                min={new Date().toISOString().slice(0, 10)}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Date
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate || new Date().toISOString().slice(0, 10)}
                onChange={handleChange}
                required
              />
            </label>

            <label className="leave-reason">
              Reason
              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                rows={3}
                placeholder="Enter the reason for your leave"
                required
              />
            </label>

            <button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Leave Request"}
            </button>
          </form>
        </section>
      )}

      <section className="leave-card">
        <div className="leave-list-heading">
          <h2>{isAdmin ? "Employee Leave Requests" : "My Leave Requests"}</h2>

          <input
            type="search"
            placeholder="Search requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading leave requests...</p>
        ) : filteredLeaves.length === 0 ? (
          <p className="leave-muted">
            {error ? "Unable to retrieve leave requests." : "No leave requests found."}
          </p>
        ) : (
          <div className="leave-table-scroll">
            <table className="leave-table">
              <thead>
                <tr>
                  {isAdmin && <th>Employee</th>}
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave._id}>
                    {isAdmin && (
                      <td>
                        {leave.employee?.name || leave.employeeName || "—"}
                      </td>
                    )}
                    <td>{leave.leaveType || leave.type || "—"}</td>
                    <td>{getDate(leave.startDate)}</td>
                    <td>{getDate(leave.endDate)}</td>
                    <td>{leave.reason || "—"}</td>
                    <td>
                      <span className="leave-status">
                        {leave.status || "Pending"}
                      </span>
                    </td>
                    {isAdmin && (
                      <td>
                        {String(leave.status || "Pending").toLowerCase() ===
                        "pending" ? (
                          <div className="leave-actions">
                            <button
                              onClick={() => updateStatus(leave._id, "Approved")}
                            >
                              Approve
                            </button>
                            <button
                              className="leave-reject-btn"
                              onClick={() => updateStatus(leave._id, "Rejected")}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
