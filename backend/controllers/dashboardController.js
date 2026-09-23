const Employee = require("../models/Employees");
const Document = require("../models/Document");
const Leave = require("../models/Leave");
const Attendance = require("../models/Attendance");

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      pendingDocuments,
      verifiedDocuments,
      rejectedDocuments,
      pendingLeaves,
      approvedLeaves,
      rejectedLeaves,
      todayAttendance,
    ] = await Promise.all([
      Employee.countDocuments(),

      Employee.countDocuments({
        employmentStatus: "Active",
      }),

      Employee.countDocuments({
        employmentStatus: { $ne: "Active" },
      }),

      Document.countDocuments({
        status: "Pending",
      }),

      Document.countDocuments({
        status: "Verified",
      }),

      Document.countDocuments({
        status: "Rejected",
      }),

      Leave.countDocuments({
        status: "Pending",
      }),

      Leave.countDocuments({
        status: "Approved",
      }),

      Leave.countDocuments({
        status: "Rejected",
      }),

      Attendance.countDocuments({
        date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(24, 0, 0, 0)),
        },
      }),
    ]);

    res.status(200).json({
      employees: {
        total: totalEmployees,
        active: activeEmployees,
        inactive: inactiveEmployees,
      },

      documents: {
        pending: pendingDocuments,
        verified: verifiedDocuments,
        rejected: rejectedDocuments,
      },

      leaves: {
        pending: pendingLeaves,
        approved: approvedLeaves,
        rejected: rejectedLeaves,
      },

      attendance: {
        today: todayAttendance,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};