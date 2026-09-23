const Attendance = require("../models/Attendance");
const Employee = require("../models/Employees");

// Mark attendance
const markAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      date,
      checkIn,
      checkOut,
      status,
      remarks,
    } = req.body;

    if (!employeeId || !date) {
      return res.status(400).json({
        message: "Employee ID and date are required",
      });
    }

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const existingAttendance = await Attendance.findOne({
      employee: employeeId,
      date: new Date(date),
    });

    if (existingAttendance) {
      return res.status(400).json({
        message: "Attendance already exists for this date",
      });
    }

    const attendance = await Attendance.create({
      employee: employeeId,
      date: new Date(date),
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      status: status || "Present",
      remarks,
      markedBy: req.user._id,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("MARK ATTENDANCE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get attendance
const getAttendance = async (req, res) => {
  try {
    const { employeeId } = req.query;

    const filter = {};

    if (employeeId) {
      filter.employee = employeeId;
    }

    const attendance = await Attendance.find(filter)
      .populate(
        "employee",
        "employeeId firstName lastName department designation"
      )
      .populate("markedBy", "name email role")
      .sort({ date: -1 });

    res.status(200).json({
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    console.error("GET ATTENDANCE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update attendance
const updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        message: "Attendance record not found",
      });
    }

    const {
      checkIn,
      checkOut,
      status,
      remarks,
    } = req.body;

    attendance.checkIn =
      checkIn !== undefined
        ? checkIn
          ? new Date(checkIn)
          : null
        : attendance.checkIn;

    attendance.checkOut =
      checkOut !== undefined
        ? checkOut
          ? new Date(checkOut)
          : null
        : attendance.checkOut;

    attendance.status = status || attendance.status;
    attendance.remarks =
      remarks !== undefined ? remarks : attendance.remarks;

    await attendance.save();

    res.status(200).json({
      message: "Attendance updated successfully",
      attendance,
    });
  } catch (error) {
    console.error("UPDATE ATTENDANCE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  updateAttendance,
};