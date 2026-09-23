const Leave = require("../models/Leave");
const Employee = require("../models/Employees");

// Apply for leave
const applyLeave = async (req, res) => {
  try {
    const {
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
    } = req.body;

    if (
      !employeeId ||
      !leaveType ||
      !startDate ||
      !endDate ||
      !reason
    ) {
      return res.status(400).json({
        message: "All leave fields are required",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const leave = await Leave.create({
      employee: employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      appliedBy: req.user._id,
      status: "Pending",
    });

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave,
    });
  } catch (error) {
    console.error("APPLY LEAVE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all leaves
const getLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate(
        "employee",
        "employeeId firstName lastName department designation"
      )
      .populate("appliedBy", "name email role")
      .populate("reviewedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: leaves.length,
      leaves,
    });
  } catch (error) {
    console.error("GET LEAVES ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Approve or reject leave
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewRemarks } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be Approved or Rejected",
      });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "Leave application not found",
      });
    }

    if (leave.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending leave applications can be reviewed",
      });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.reviewRemarks = reviewRemarks || "";

    await leave.save();

    const updatedLeave = await Leave.findById(leave._id)
      .populate(
        "employee",
        "employeeId firstName lastName department designation"
      )
      .populate("appliedBy", "name email role")
      .populate("reviewedBy", "name email role");

    res.status(200).json({
      message: `Leave ${status.toLowerCase()} successfully`,
      leave: updatedLeave,
    });
  } catch (error) {
    console.error("REVIEW LEAVE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  applyLeave,
  getLeaves,
  reviewLeave,
};