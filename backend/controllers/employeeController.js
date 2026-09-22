const Employee = require("../models/Employees");

// Create employee
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      joiningDate,
      employmentStatus,
      address,
    } = req.body;

    if (!employeeId || !firstName || !lastName || !email) {
      return res.status(400).json({
        message: "Employee ID, first name, last name and email are required",
      });
    }

    const existingEmployee = await Employee.findOne({ employeeId });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already exists",
      });
    }

    const employee = await Employee.create({
      employeeId,
      user: req.user._id,
      firstName,
      lastName,
      email,
      phone,
      department,
      designation,
      joiningDate,
      employmentStatus,
      address,
    });

    res.status(201).json({
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("user", "name email role accountStatus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: employees.length,
      employees,
    });
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate("user", "name email role accountStatus");

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json({
      employee,
    });
  } catch (error) {
    console.error("GET EMPLOYEE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = {
  createEmployee,
  getEmployees,
  getEmployeeById,
};