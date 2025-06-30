const barangRusakModel = require("../models/barangRusak.js");

const getBarangRusakByTahun = async (req, res) => {
  try {
    const { tahun } = req.params;
    const result = await barangRusakModel.getBarangRusakByTahun(tahun);
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan data barang rusak",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan data barang rusak",
      error: error.message,
    });
  }
};

const getBarangRusakByNo = async (req, res) => {
  const { no_barang_rusak } = req.params;
  try {
    const result = await barangRusakModel.getBarangRusakByNo(no_barang_rusak);
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan detail barang rusak",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan detail barang rusak",
      error: error.message,
    });
  }
};

const getNoBarangRusak = async (req, res) => {
  try {
    const result = await barangRusakModel.getNoBarangRusak();
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan nomor barang rusak",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan nomor barang rusak",
      error: error.message,
    });
  }
};

const createBarangRusak = async (req, res) => {
  const { no_barang_rusak, id_supplier, tanggal, total_harga_barang_rusak, barang } = req.body;
  try {
    const result = await barangRusakModel.createBarangRusak(
      no_barang_rusak,
      id_supplier,
      tanggal,
      total_harga_barang_rusak,
      barang
    );
    if (result.status) {
      res.status(201).json({
        status: "success",
        message: result.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Gagal menambahkan barang rusak",
        error: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menambahkan barang rusak",
      error: error.message,
    });
  }
};

const updateBarangRusak = async (req, res) => {
  const { no_barang_rusak, tanggal, total_harga_barang_rusak, barang } = req.body;
  try {
    const result = await barangRusakModel.updateBarangRusak(
      no_barang_rusak,
      tanggal,
      total_harga_barang_rusak,
      barang
    );
    if (result.status) {
      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui barang rusak",
        error: result.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal memperbarui barang rusak",
      error: error.message,
    });
  }
};

const getDetailPembelianByKodeBarangAndSupplier = async (req, res) => {
  const { kode_barang, id_supplier } = req.params;

  if (!kode_barang || !id_supplier) {
    return res.status(400).json({
      status: "error",
      message: "Kode barang dan ID supplier diperlukan",
    });
  }

  try {
    const result =
      await barangRusakModel.getDetailPembelianByKodeBarangAndSupplier(
        kode_barang,
        id_supplier
      );
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan detail pembelian",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan detail pembelian",
      error: error.message,
    });
  }
};

const barangRusakController = {
  getBarangRusakByTahun,
  getBarangRusakByNo,
  getNoBarangRusak,
  createBarangRusak,
  updateBarangRusak,
  getDetailPembelianByKodeBarangAndSupplier,
};

module.exports = barangRusakController;
