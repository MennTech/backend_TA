const kategoriModel = require("../models/kategori.js");

const getAllKategori = async (req, res) => {
  try {
    const result = await kategoriModel.getAllKategori();
    return res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua kategori",
      data: {
        kategori: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua kategori",
      error: error.message,
    });
  }
};

const createKategori = async (req, res) => {
  try {
    const { nama, stok_minimal } = req.body;

    const result = await kategoriModel.createKategori(nama, stok_minimal);
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Berhasil membuat kategori",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal membuat kategori",
      error: error.message,
    });
  }
};

const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, stok_minimal } = req.body;

    const result = await kategoriModel.updateKategori(id, nama, stok_minimal);
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
      message: "Gagal memperbarui kategori",
      error: error.message,
    });
  }
};

const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await kategoriModel.deleteKategori(id);
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
      message: "Gagal menghapus kategori",
      error: error.message,
    });
  }
};

const getKategoriTerlaris = async (req, res) => {
  try {
    const { filter } = req.params;
    const result = await kategoriModel.getKategoriTerlaris(filter);
    return res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan kategori terlaris",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan kategori terlaris",
      error: error.message,
    });
  }
};

const kategoriController = {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  getKategoriTerlaris,
};

module.exports = kategoriController;
