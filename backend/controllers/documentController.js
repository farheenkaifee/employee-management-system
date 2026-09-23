const Document = require("../models/Document");
const Employee = require("../models/Employees");

const uploadDocument = async (req, res) => {
  try {
    const {
      employeeId,
      documentType,
      documentName,
      remarks,
    } = req.body;

    if (!employeeId || !documentType || !documentName) {
      return res.status(400).json({
        message: "Employee ID, document type and document name are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const document = await Document.create({
      employee: employee._id,
      documentType,
      documentName,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      status: "Pending",
      uploadedBy: req.user._id,
      remarks,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("UPLOAD DOCUMENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all documents for an employee
const getEmployeeDocuments = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const documents = await Document.find({
      employee: employeeId,
    })
      .populate("uploadedBy", "name email role")
      .populate("employee", "employeeId firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: documents.length,
      documents,
    });
  } catch (error) {
    console.error("GET EMPLOYEE DOCUMENTS ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Verify or reject document
const verifyDocument = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }

    if (!["Verified", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Verified or Rejected",
      });
    }

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (document.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending documents can be verified or rejected",
      });
    }

    document.status = status;
    document.remarks = remarks ?? document.remarks;
    document.verifiedBy = req.user._id;
    document.verifiedAt = new Date();

    await document.save();

    const updatedDocument = await Document.findById(document._id)
      .populate("employee", "employeeId firstName lastName email")
      .populate("uploadedBy", "name email role")
      .populate("verifiedBy", "name email role");

    res.status(200).json({
      message: `Document ${status.toLowerCase()} successfully`,
      document: updatedDocument,
    });
  } catch (error) {
    console.error("VERIFY DOCUMENT ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadDocument,
  getEmployeeDocuments,
  verifyDocument,
};