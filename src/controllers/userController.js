const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

const getKaryawan = async (req, res) => {
  try {
    const result = await userModel.getKaryawan();
    return res.status(200).json({
      status: "success",
      message: "Data karyawan berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(201).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
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
    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Gagal memperbarui karyawan",
      error: error.message,
    });
  }
};

const ubahPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const username = req.user.username; 

  try {
    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        status: "error",
        message: "Password lama salah.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const result = await userModel.ubahPassword(username, hashedNewPassword);

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
      message: "Terjadi kesalahan pada server.",
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
    return res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    return res.status(500).json({
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
