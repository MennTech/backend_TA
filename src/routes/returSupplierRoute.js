const express = require("express");
const returSupplierController = require("../controllers/returSupplierController");
const returSupplierSchema = require("../validations/returSupplierValidation");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get(
  "/tahun/:tahun",
  authenticate,
  isAdmin,
  returSupplierController.getReturSupplierByTahun
);
router.get(
  "/supplier/:id_supplier",
  authenticate,
  isAdmin,
  returSupplierController.getBarangRusakBySupplier
);
router.get(
  "/no/:no_retur_supplier",
  authenticate,
  isAdmin,
  returSupplierController.getDetailReturSupplier
);
router.get(
  "/no-retur-supplier",
  authenticate,
  isAdmin,
  returSupplierController.getNoReturSupplier
);
router.post(
  "/",
  authenticate,
  isAdmin,
  validate(returSupplierSchema),
  returSupplierController.createReturSupplier
);

module.exports = router;
