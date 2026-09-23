const bcrypt = require("bcryptjs");

const User = require("../models/User");

const Employee = require("../models/Employees");

// Create employee
// Create employee
const createEmployee = async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      password,
      phone,
      department,
      designation,
      joiningDate,
      employmentStatus,
      address,
    } = req.body;

    if (
      !employeeId ||
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Employee ID, first name, last name, email and password are required",
      });
    }

    const existingEmployee = await Employee.findOne({
      employeeId,
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee ID already exists",
      });
    }

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      role: "employee",
      accountStatus: "Active",
    });

    const employee = await Employee.create({
      employeeId,
      user: user._id,
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
      message: "Employee and user account created successfully",

      employee,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
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



// Update employee
const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const {
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

    employee.firstName = firstName ?? employee.firstName;
    employee.lastName = lastName ?? employee.lastName;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;
    employee.department = department ?? employee.department;
    employee.designation = designation ?? employee.designation;
    employee.joiningDate = joiningDate ?? employee.joiningDate;
    employee.employmentStatus =
      employmentStatus ?? employee.employmentStatus;
    employee.address = address ?? employee.address;

    const updatedEmployee = await employee.save();

    res.status(200).json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("UPDATE EMPLOYEE ERROR:", error.message);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Deactivate employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    employee.employmentStatus = "Inactive";

    await employee.save();

    res.status(200).json({
      message: "Employee deactivated successfully",
      employee,
    });
  } catch (error) {
    console.error("DEACTIVATE EMPLOYEE ERROR:", error.message);

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
  updateEmployee,
  deleteEmployee
};