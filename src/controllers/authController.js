const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Username tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: token,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Gagal login",
      error: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: "success",
    message: "Logout berhasil",
  });
};

const hashPassword = async (req, res) => {
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  res.status(200).json({
    status: "success",
    message: "Password hashed successfully",
    hashedPassword,
  });
};

const cekToken = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    res.status(200).json({
      status: "success",
      message: "Token valid",
      user: decoded,
    });
  } catch (error) {
    return res.status(403).json({
      status: "error",
      message: "Unauthorized",
      error: error.message,
    });
  }
};

const verifyPassword = async (req, res) => {
  const { password, role } = req.body;
  if (!password || !role) {
    return res.status(400).json({
      status: "error",
      message: "Password dan role harus diisi",
    });
  }
  try {
    const result = await userModel.findByRole(role);
    if (!result || result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Role tidak ditemukan",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, result[0].password);

    if (isPasswordValid) {
      return res
        .status(200)
        .json({ status: "success", message: "Password terverifikasi." });
    } else {
      return res
        .status(401)
        .json({ status: "error", message: "Password salah." });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server.",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  logout,
  hashPassword,
  cekToken,
  verifyPassword,
};
