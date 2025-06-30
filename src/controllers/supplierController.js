const supplierModel = require("../models/supplier.js");

const getAllSupplier = async (req, res) => {
  try {
    const data = await supplierModel.getAllSupplier();
    res.status(200).json({
      status: "success",
      message: "Berhasil Mendapatkan semua supplier",
      data: {
        supplier: data,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan semua supplier",
      error: error.message,
    });
  }
};

const createSupplier = async (req, res) => {
  try {
    const { nama, kode_supplier, no_telpon, alamat } = req.body;
    const result = await supplierModel.createSupplier(
      nama,
      kode_supplier,
      no_telpon,
      alamat
    );
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }
    res.status(201).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal membuat supplier",
      error: error.message,
    });
  }
};

const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, kode_supplier, no_telpon, alamat } = req.body;

    const result = await supplierModel.updateSupplier(
      id,
      nama,
      kode_supplier,
      no_telpon,
      alamat
    );
    if (!result.status) {
      return res.status(400).json({
        status: "error",
        error: result.message,
      });
    }
    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengupdate supplier",
      error: error.message,
    });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await supplierModel.deleteSupplier(id);

    if (!result.status) {
      return res.status(400).json({
        status: "error",
        message: result.message,
      });
    }

    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal menghapus supplier",
      error: error.message,
    });
  }
};

const getJumlahSupplier = async (req, res) => {
  try {
    const result = await supplierModel.getJumlahSupplier();
    res.status(200).json({
      status: "success",
      message: "Berhasil mendapatkan jumlah supplier",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mendapatkan jumlah supplier",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getJumlahSupplier
};
