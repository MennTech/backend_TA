const userController = require("../controllers/userController");
const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", authenticate, isAdmin, userController.getKaryawan);
router.post(
  "/create-karyawan",
  authenticate,
  isAdmin,
  userController.createKaryawan
);
router.put(
  "/update-karyawan/:id",
  authenticate,
  isAdmin,
  userController.updateKaryawan
);

router.delete(
  "/delete-karyawan/:id",
  authenticate,
  isAdmin,
  userController.deleteKaryawan
);

router.put("/ubah-password", authenticate, userController.ubahPassword);

module.exports = router;
