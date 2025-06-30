const pembelianModel = require("../models/pembelian.js");

const getNoPembelian = async (req, res) => {
  try {
    const result = await pembelianModel.getNoPembelian();
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan nomor pembelian",
      data: {
        no_pembelian: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan nomor pembelian",
      error: error.message,
    });
  }
};

const getPembelianByTahun = async (req, res) => {
  try {
    const { tahun } = req.params;
    const result = await pembelianModel.getPembelianByTahun(tahun);
    return res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua pembelian",
      data: {
        pembelian: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua pembelian",
      error: error.message,
    });
  }
};

const getPembelianByNo = async (req, res) => {
  try {
    const { no_pembelian } = req.params;
    const result = await pembelianModel.getPembelianByNo(no_pembelian);
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan pembelian",
      data: {
        pembelian: result.pembelian,
        detailPembelian: result.detailPembelian,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan pembelian",
      error: error.message,
    });
  }
};

const createPembelian = async (req, res) => {
  try {
    const { no_pembelian, id_supplier, tanggal, total_harga, lunas, barang } =
      req.body;
    const result = await pembelianModel.createPembelian(
      no_pembelian,
      id_supplier,
      tanggal,
      total_harga,
      lunas,
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
      message: "Berhasil menambahkan data pembelian",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal membuat pembelian",
      error: error.message,
    });
  }
};

const updatePembelian = async (req, res) => {
  try {
    const { no_pembelian, id_supplier, tanggal, total_harga, lunas, barang } =
      req.body;

    const result = await pembelianModel.updatePembelian(
      no_pembelian,
      id_supplier,
      tanggal,
      total_harga,
      lunas,
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
      message: "Gagal memperbarui pembelian",
      error: error.message,
    });
  }
};

const pelunasanHutang = async (req, res) => {
  try {
    const { no_pembelian } = req.params;
    const result = await pembelianModel.pelunasanHutang(no_pembelian);
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
      message: "Gagal melakukan pelunasan hutang",
      error: error.message,
    });
  }
};

const pembelianController = {
  getNoPembelian,
  getPembelianByTahun,
  getPembelianByNo,
  createPembelian,
  updatePembelian,
  pelunasanHutang,
};

module.exports = pembelianController;
