const express = require("express");

const {
  uploadDocument, getEmployeeDocuments, verifyDocument
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorizeRoles("admin", "hr"),
  upload.single("file"),
  uploadDocument
);

router.get(
  "/employee/:employeeId",
  protect,
  authorizeRoles("admin", "hr"),
  getEmployeeDocuments
);

router.put(
  "/:id/verify",
  protect,
  authorizeRoles("admin", "hr"),
  verifyDocument
);

module.exports = router;