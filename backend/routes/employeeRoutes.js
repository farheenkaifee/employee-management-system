const express = require("express");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../controllers/employeeController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "hr"), createEmployee);

router.get("/", protect, authorizeRoles("admin", "hr"), getEmployees);

router.get("/:id", protect, authorizeRoles("admin", "hr"), getEmployeeById);

router.put("/:id", protect, authorizeRoles("admin", "hr"), updateEmployee);

router.delete("./:id", protect, authorizeRoles("admin", "hr"), deleteEmployee);

module.exports = router;