const express = require("express");
const barangController = require("../controllers/barangController.js");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get("/kasir", authenticate, barangController.getAllBarangKasir);
router.get("/admin", authenticate, isAdmin, barangController.getAllBarangAdmin);
router.get("/total-barang", authenticate, barangController.getTotalBarang);
router.get("/stok-menipis", authenticate, barangController.getBarangStokMenipis);
router.get("/:kode_barang", authenticate, barangController.getBarangByKode);
router.get(
  "/pembelian/:kode_barang",
  authenticate,
  isAdmin,
  barangController.getBarangByKodePembelian
);
router.get(
  "/ekspor-barcode/:kode_barang",
  authenticate,
  isAdmin,
  barangController.getBarangByKodeEksporBarcode
);

router.get("/terlaris/:filter", authenticate, isAdmin, barangController.getBarangTerlaris);

router.post(
  "/ekspor-barcode",
  authenticate,
  isAdmin,
  barangController.exportExcel
);

module.exports = router;
