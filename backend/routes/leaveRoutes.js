const express = require("express");

const {
  applyLeave,
  getLeaves,
  reviewLeave,
} = require("../controllers/leaveController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  applyLeave
);

router.get(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  getLeaves
);

router.put(
  "/:id/review",
  protect,
  authorizeRoles("admin", "hr"),
  reviewLeave
);

module.exports = router;