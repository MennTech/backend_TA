const satuanModel = require("../models/satuan.js");

const getAllSatuan = async (req, res) => {
  try {
    const result = await satuanModel.getAllSatuan();
    return res.status(200).json({
      status: "success",
      data: {
        satuan: result,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua satuan",
      error: error.message,
    });
  }
};

const createSatuan = async (req, res) => {
  try {
    const { nama, jumlah_satuan } = req.body;
    const result = await satuanModel.createSatuan(nama, jumlah_satuan);
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(201).json({
      status: "success",
      message: "Berhasil membuat satuan",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal membuat satuan",
      error: error.message,
    });
  }
};

const updateSatuan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, jumlah_satuan } = req.body;

    const result = await satuanModel.updateSatuan(id, nama, jumlah_satuan);
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Berhasil memperbarui satuan",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui satuan",
      error: error.message,
    });
  }
};

const deleteSatuan = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await satuanModel.deleteSatuan(id);
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Berhasil menghapus satuan",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal menghapus satuan",
      error: error.message,
    });
  }
};

const satuanController = {
  getAllSatuan,
  createSatuan,
  updateSatuan,
  deleteSatuan,
};

module.exports = satuanController;
