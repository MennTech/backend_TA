const express = require("express");
const barangRusakController = require("../controllers/barangRusakController");
const barangRusakValidation = require("../validations/barangRusakValidation");
const validate = require("../middleware/validate");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get("/tahun/:tahun", authenticate, isAdmin, barangRusakController.getBarangRusakByTahun);
router.get("/no/:no_barang_rusak", authenticate, isAdmin, barangRusakController.getBarangRusakByNo);
router.get("/no-barang-rusak", authenticate, isAdmin, barangRusakController.getNoBarangRusak);
router.post(
  "/",
  validate(barangRusakValidation),
  barangRusakController.createBarangRusak
);
router.put(
  "/",
  authenticate, 
  isAdmin,
  validate(barangRusakValidation),
  barangRusakController.updateBarangRusak
);

router.get("/detail/:kode_barang/:id_supplier", authenticate, isAdmin, barangRusakController.getDetailPembelianByKodeBarangAndSupplier);

module.exports = router;