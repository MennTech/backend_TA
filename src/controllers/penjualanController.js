const penjualanModel = require("../models/penjualan.js");

const getNoPenjualan = async (req, res) => {
  try {
    const result = await penjualanModel.getNoPenjualan();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan nomor penjualan",
      data: {
        no_penjualan: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan nomor penjualan",
      error: error.message,
    });
  }
};

const getPenjualan = async (req, res) => {
  try {
    const {
      tahun = new Date().getFullYear(),
      bulan = new Date().getMonth() + 1,
    } = req.query;
    const result = await penjualanModel.getPenjualan(tahun, bulan);
    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: result.message,
      data: {
        penjualan: result.data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua penjualan",
      error: error.message,
    });
  }
};

const getPenjualanByNo = async (req, res) => {
  try {
    const { no_penjualan } = req.params;
    const result = await penjualanModel.getPenjualanByNo(no_penjualan);
    if (!result.status) {
      return res.status(404).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: result.message,
      data: {
        penjualan: result.data,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan penjualan",
      error: error.message,
    });
  }
};

const createPenjualan = async (req, res) => {
  try {
    const {
      no_penjualan,
      tanggal,
      total_harga,
      metode_pembayaran,
      jumlah_bayar,
      kembalian,
      barang,
    } = req.body;
    const id_user = req.user.id;
    const result = await penjualanModel.createPenjualan(
      no_penjualan,
      id_user,
      tanggal,
      total_harga,
      metode_pembayaran,
      jumlah_bayar,
      kembalian,
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
      message: "Gagal membuat penjualan",
      error: error.message,
    });
  }
};

const getJumlahTransaksiPenjualan = async (req, res) => {
  try {
    const result = await penjualanModel.getJumlahTransaksiPenjualan();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan jumlah transaksi penjualan",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan jumlah transaksi penjualan",
      error: error.message,
    });
  }
};

const getPendapatanHarIini = async (req, res) => {
  try {
    const result = await penjualanModel.getPendapatanHariIni();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan pendapatan hari ini",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan pendapatan hari ini",
      error: error.message,
    });
  }
};

const getPendapatanByFilter = async (req, res) => {
  try {
    const { filter } = req.params;
    const result = await penjualanModel.getPendapatanByFilter(filter);
    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan pendapatan berdasarkan filter",
      error: error.message,
    });
  }
};

module.exports = {
  getNoPenjualan,
  getPenjualan,
  getPenjualanByNo,
  createPenjualan,
  getJumlahTransaksiPenjualan,
  getPendapatanHarIini,
  getPendapatanByFilter,
};
