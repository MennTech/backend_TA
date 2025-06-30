const express = require("express");
const laporanController = require("../controllers/laporanController");
const authenticate = require("../middleware/authMiddleware.js");
const isAdmin = require("../middleware/isAdmin.js");

const router = express.Router();

router.get(
  "/penjualan",
  authenticate,
  isAdmin,
  laporanController.getLaporanPenjualan
);

router.get(
  "/barang-lambat-terjual",
  authenticate,
  isAdmin,
  laporanController.getLaporanBarangLambatTerjual
);

router.get(
  "/pembelian",
  authenticate,
  isAdmin,
  laporanController.getLaporanPembelian
);

router.get(
  "/utang-pembelian-belum-lunas",
  authenticate,
  isAdmin,
  laporanController.getLaporanUtangPembelianBelumLunas
);

router.get(
  "/laba-kotor",
  authenticate,
  isAdmin,
  laporanController.getLaporanLabaKotor
);

router.get(
  "/barang-rusak",
  authenticate,
  isAdmin,
  laporanController.getLaporanBarangRusak
);

router.get(
  "/retur-supplier",
  authenticate,
  isAdmin,
  laporanController.getLaporanReturSupplier
);

router.get(
  "/retur-penjualan",
  authenticate,
  isAdmin,
  laporanController.getLaporanReturPenjualan
);

module.exports = router;
