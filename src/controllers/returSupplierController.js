const returSupplierModel = require("../models/returSupplier.js");

const getReturSupplierByTahun = async (req, res) => {
  const { tahun } = req.params;
  try {
    const result = await returSupplierModel.getReturSupplierByTahun(tahun);
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan semua data retur supplier",
      data: {
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua data retur supplier",
      error: error.message,
    });
  }
};

const getNoReturSupplier = async (req, res) => {
  try {
    const result = await returSupplierModel.getNoReturSupplier();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan no retur supplier",
      data: {
        no_retur_supplier: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan no retur supplier",
      error: error.message,
    });
  }
};

const getDetailReturSupplier = async (req, res) => {
  try {
    const { no_retur_supplier } = req.params;
    const result = await returSupplierModel.getDetailReturSupplier(
      no_retur_supplier
    );
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil detail retur supplier",
      data: {
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mengambil detail retur supplier",
      error: error.message,
    });
  }
};

const getBarangRusakBySupplier = async (req, res) => {
  try {
    const { id_supplier } = req.params;
    const result = await returSupplierModel.getBarangRusakBySupplier(
      id_supplier
    );
    return res.status(200).json({
      status: "success",
      message: "Berhasil mengambil data barang rusak sesuai supplier",
      data: {
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan data barang rusak sesuai supplier",
      error: error.message,
    });
  }
};

const createReturSupplier = async (req, res) => {
  try {
    const { no_retur_supplier, id_supplier, tanggal, keterangan, barang } =
      req.body;
    const result = await returSupplierModel.createReturSupplier(
      no_retur_supplier,
      id_supplier,
      tanggal,
      keterangan,
      barang
    );
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal membuat retur supplier",
      error: error.message,
    });
  }
};

const returSupplierController = {
  getReturSupplierByTahun,
  getBarangRusakBySupplier,
  getDetailReturSupplier,
  getNoReturSupplier,
  createReturSupplier,
};

module.exports = returSupplierController;
