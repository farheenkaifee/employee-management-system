const express = require("express");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createEmployee);

router.get("/", protect, getEmployees);

router.get("/:id", protect, getEmployeeById);

module.exports = router;