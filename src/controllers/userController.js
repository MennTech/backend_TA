const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const getKaryawan = async (req, res) => {
  try {
    const result = await userModel.getKaryawan();
    res.status(200).json({
      status: "success",
      message: "Data karyawan berhasil diambil",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal mengambil data karyawan",
      error: error.message,
    });
  }
};

const createKaryawan = async (req, res) => {
  const data = req.body;
  const kasir = {
    username: data.username,
    password: bcrypt.hashSync(data.password, 10),
    role: "kasir",
  };
  try {
    const result = await userModel.createKaryawan(kasir);
    res.status(201).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateKaryawan = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  if (newData.password) {
    newData.password = bcrypt.hashSync(newData.password, 10);
  }
  try {
    const result = await userModel.updateKaryawan(id, newData);
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
      message: "Gagal memperbarui karyawan",
      error: error.message,
    });
  }
};

const ubahPassword = async (req, res) => {
  const { newPassword } = req.body;
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const result = await userModel.ubahPassword(hashedPassword);
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
      message: "Gagal mengubah password",
      error: error.message,
    });
  }
};

const deleteKaryawan = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userModel.deleteKaryawan(id);
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
      message: "Gagal menghapus karyawan",
      error: error.message,
    });
  }
};

module.exports = {
  getKaryawan,
  createKaryawan,
  ubahPassword,
  updateKaryawan,
  deleteKaryawan,
};
