const express = require("express");
const returPenjualanController = require("../controllers/returPenjualanController.js");
const returPenjualanValidation = require("../validations/returPenjualanValidation.js");
const validate = require("../middleware/validate.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get(
  "/tahun/:tahun",
  authenticate,
  isAdmin,
  returPenjualanController.getReturPenjualanByTahun
);
router.get(
  "/no/:no_retur_penjualan",
  authenticate,
  isAdmin,
  returPenjualanController.getReturPenjualanByNo
);
router.get(
  "/no-retur-penjualan",
  authenticate,
  isAdmin,
  returPenjualanController.getNoReturPenjualan
);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(returPenjualanValidation),
  returPenjualanController.createReturPenjualan
);

module.exports = router;
