const express = require("express");

const {
  markAttendance,
  getAttendance,
  updateAttendance,
} = require("../controllers/attendanceController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  markAttendance
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getAttendance
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "hr"),
  updateAttendance
);

module.exports = router;