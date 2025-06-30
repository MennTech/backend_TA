const express = require("express");
const penjualanController = require("../controllers/penjualanController.js");
const penjualanValidation = require("../validations/penjualanValidation.js");
const validate = require("../middleware/validate.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get("/", authenticate, isAdmin, penjualanController.getPenjualan);
router.get("/no-penjualan", authenticate, penjualanController.getNoPenjualan);
router.get(
  "/jumlah-transaksi",
  authenticate,
  isAdmin,
  penjualanController.getJumlahTransaksiPenjualan
);

router.get(
  "/pendapatan-hari-ini",
  authenticate,
  isAdmin,
  penjualanController.getPendapatanHarIini
);

router.get(
  "/pendapatan/:filter",
  authenticate,
  isAdmin,
  penjualanController.getPendapatanByFilter
);

router.get(
  "/no/:no_penjualan",
  authenticate,
  isAdmin,
  penjualanController.getPenjualanByNo
);
router.post(
  "/",
  authenticate,
  validate(penjualanValidation),
  penjualanController.createPenjualan
);

module.exports = router;
