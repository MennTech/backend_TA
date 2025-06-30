const returPenjualanModel = require("../models/returPenjualan.js");

const getReturPenjualanByTahun = async (req, res) => {
  try {
    const { tahun } = req.params;
    const result = await returPenjualanModel.getReturPenjualanByTahun(tahun);
    return res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua retur penjualan",
      data: {
        retur_penjualan: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua retur penjualan",
      error: error.message,
    });
  }
};

const getReturPenjualanByNo = async (req, res) => {
  try {
    const { no_retur_penjualan } = req.params;
    const result = await returPenjualanModel.getReturPenjualanByNo(
      no_retur_penjualan
    );
    return res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua detail retur penjualan",
      data: {
        result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua detail retur penjualan",
      error: error.message,
    });
  }
};

const getNoReturPenjualan = async (req, res) => {
  try {
    const result = await returPenjualanModel.getNoReturPenjualan();
    return res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua detail retur penjualan",
      data: {
        no_retur_penjualan: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua detail retur penjualan",
      error: error.message,
    });
  }
};

const createReturPenjualan = async (req, res) => {
  try {
    const { no_retur_penjualan, no_penjualan, tanggal, total, barang } =
      req.body;

    const result = await returPenjualanModel.createReturPenjualan(
      no_retur_penjualan,
      no_penjualan,
      tanggal,
      total,
      barang
    );
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(201).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua detail retur penjualan",
      error: error.message,
    });
  }
};

const returPenjualanController = {
  getReturPenjualanByTahun,
  getReturPenjualanByNo,
  getNoReturPenjualan,
  createReturPenjualan,
};

module.exports = returPenjualanController;
