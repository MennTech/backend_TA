const express = require("express");
const pembelianController = require("../controllers/pembelianController.js");
const pembelianValidation = require("../validations/pembelianValidation.js");
const validate = require("../middleware/validate.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get(
  "/no-pembelian",
  authenticate,
  isAdmin,
  pembelianController.getNoPembelian
);
router.get(
  "/tahun/:tahun",
  authenticate,
  isAdmin,
  pembelianController.getPembelianByTahun
);
router.get(
  "/no/:no_pembelian",
  authenticate,
  isAdmin,
  pembelianController.getPembelianByNo
);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(pembelianValidation),
  pembelianController.createPembelian
);
router.put(
  "/",
  authenticate,
  isAdmin,
  validate(pembelianValidation),
  pembelianController.updatePembelian
);

router.put(
  "/pelunasan/:no_pembelian",
  authenticate,
  isAdmin,
  pembelianController.pelunasanHutang
);

module.exports = router;
