const express = require('express');
const supplierRouter = require('./supplierRoute.js');
const kategoriRouter = require('./kategoriRoute.js');
const satuanRouter = require('./satuanRoute.js');
const pembelianRouter = require('./pembelianRoute.js');
const barangRouter = require('./barangRoute.js');
const penjualanRouter = require('./penjualanRoute.js');
const returPenjualanRouter = require('./returPenjualanRoute.js');
const barangRusakRouter = require('./barangRusakRoute.js');
const returSupplierRouter = require('./returSupplierRoute.js');
const authRouter = require('./authRoute.js');
const laporanRouter = require('./laporanRoute.js');
const userRouter = require('./userRoute.js');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/supplier', supplierRouter);
router.use('/kategori', kategoriRouter);
router.use('/satuan', satuanRouter);
router.use('/pembelian', pembelianRouter);
router.use('/barang', barangRouter);
router.use('/penjualan', penjualanRouter);
router.use('/retur-penjualan', returPenjualanRouter);
router.use('/barang-rusak', barangRusakRouter);
router.use('/retur-supplier', returSupplierRouter);
router.use('/laporan', laporanRouter);
router.use('/user', userRouter);

module.exports = router;