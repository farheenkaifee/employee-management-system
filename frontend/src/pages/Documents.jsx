
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [employeeId, setEmployeeId] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadDocuments = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/documents");
      const data = response.data;

      setDocuments(
        Array.isArray(data)
          ? data
          : data.documents || data.data || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load documents. Check the document API."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a document.");
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF, JPG, and PNG files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("The file size must not exceed 5 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    // Include this only if your backend supports employee selection.
    if (employeeId.trim()) {
      formData.append("employeeId", employeeId.trim());
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      await api.post("/documents", formData);

      setMessage("Document uploaded successfully.");
      setFile(null);
      setEmployeeId("");

      const input = document.getElementById("document-file-input");
      if (input) input.value = "";

      await loadDocuments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Upload failed. Check the upload field name and API route."
      );
    } finally {
      setUploading(false);
    }
  };

  const updateStatus = async (documentId, status) => {
    setError("");
    setMessage("");

    try {
      await api.patch(`/documents/${documentId}/status`, { status });
      setMessage(`Document marked ${status.toLowerCase()}.`);
      await loadDocuments();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update status. Check admin permissions and API route."
      );
    }
  };

  const filteredDocuments = documents.filter((doc) => {
    const query = search.toLowerCase();

    return [
      doc.name,
      doc.fileName,
      doc.originalName,
      doc.documentType,
      doc.status,
      doc.employee?.name,
      doc.employeeName,
    ].some((value) => String(value || "").toLowerCase().includes(query));
  });

  return (
    <div className="documents-page">
      <div className="documents-heading">
        <div>
          <h1>Documents</h1>
          <p>Upload and manage employee documents.</p>
        </div>
      </div>

      {error && <div className="document-alert document-error">{error}</div>}
      {message && <div className="document-alert document-success">{message}</div>}

      <section className="document-card">
        <h2>Upload a Document</h2>

        <form onSubmit={handleUpload} className="document-upload-form">
          <label>
            Employee ID (if required by your backend)
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter employee ID"
            />
          </label>

          <label>
            Select file
            <input
              id="document-file-input"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </label>

          <p className="document-hint">PDF, JPG, or PNG — maximum 5 MB.</p>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </section>

      <section className="document-card">
        <div className="document-list-heading">
          <h2>Document Records</h2>
          <input
            type="search"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search documents"
          />
        </div>

        {loading ? (
          <p>Loading documents...</p>
        ) : filteredDocuments.length === 0 ? (
          <p className="document-hint">
            {error ? "Unable to retrieve document records." : "No documents found."}
          </p>
        ) : (
          <div className="document-table-scroll">
            <table className="document-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => (
                  <tr key={doc._id}>
                    <td>{doc.originalName || doc.fileName || doc.name || "Document"}</td>
                    <td>
                      {doc.employee?.name ||
                        doc.employeeName ||
                        doc.employeeId ||
                        "—"}
                    </td>
                    <td>
                      <span className="document-status">
                        {doc.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <div className="document-actions">
                        <button
                          onClick={() =>
                            updateStatus(doc._id, "Verified")
                          }
                        >
                          Verify
                        </button>
                        <button
                          className="document-reject-btn"
                          onClick={() =>
                            updateStatus(doc._id, "Rejected")
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </td>
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
