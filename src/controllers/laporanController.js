const laporanModel = require("../models/laporan");

const getLaporanPenjualan = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanPenjualan(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan penjualan",
      error: error.message,
    });
  }
};

const getLaporanBarangLambatTerjual = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanBarangLambatTerjual(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan barang lama terjual",
      error: error.message,
    });
  }
};

const getLaporanPembelian = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanPembelian(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan pembelian",
      error: error.message,
    });
  }
};

const getLaporanUtangPembelianBelumLunas = async (req, res) => {
  try {
    const result = await laporanModel.getLaporanUtangPembelianBelumLunas();

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan utang pembelian belum lunas",
      error: error.message,
    });
  }
};

const getLaporanLabaKotor = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanLabaKotor(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan laba kotor",
      error: error.message,
    });
  }
};

const getLaporanBarangRusak = async (req, res) => {
  const { startDate, endDate, bulan, tahun } = req.query;
  try {
    const result = await laporanModel.getLaporanBarangRusak(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan barang rusak",
      error: error.message,
    });
  }
};

const getLaporanReturSupplier = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanReturSupplier(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan retur supplier",
      error: error.message,
    });
  }
};

const getLaporanReturPenjualan = async (req, res) => {
  try {
    const { startDate, endDate, bulan, tahun } = req.query;

    const result = await laporanModel.getLaporanReturPenjualan(
      startDate,
      endDate,
      bulan,
      tahun
    );

    if (!result.status) {
      return res.status(500).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(200).json({
      status: "success",
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan laporan retur penjualan",
      error: error.message,
    });
  }
};

module.exports = {
  getLaporanPenjualan,
  getLaporanBarangLambatTerjual,
  getLaporanPembelian,
  getLaporanUtangPembelianBelumLunas,
  getLaporanLabaKotor,
  getLaporanBarangRusak,
  getLaporanReturSupplier,
  getLaporanReturPenjualan,
};
