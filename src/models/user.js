const dbPool = require("../config/db");

const findByUsername = async (username) => {
  const [rows] = await dbPool.query("SELECT * FROM user WHERE username = ?", [
    username,
  ]);
  return rows[0];
};

const findByRole = async (role) => {
  const [rows] = await dbPool.query("SELECT * FROM user WHERE role = ?", [
    role,
  ]);
  return rows;
};

const ubahPassword = async (newPassword) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.query("UPDATE user SET password = ? WHERE username = 'admin'", [
      newPassword,
    ]);
    await conn.commit();
    return {
      status: true,
      message: "Password berhasil diubah",
    };
  } catch (error) {
    await conn.rollback();
    return {
      status: false,
      message: error.message,
    };
  } finally {
    conn.release();
  }
};

const getKaryawan = async () => {
  const [rows] = await dbPool.query(
    "SELECT id, username FROM user WHERE role = 'kasir'"
  );
  return rows;
};

const createKaryawan = async (kasir) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.query(
      "INSERT INTO user (username, password, role) VALUES (?, ?, ?)",
      [kasir.username, kasir.password, kasir.role]
    );
    await conn.commit();
    return {
      status: true,
      message: "Kasir berhasil ditambahkan",
    };
  } catch (error) {
    await conn.rollback();
    return {
      status: false,
      message: error.message,
    };
  } finally {
    conn.release();
  }
};

const updateKaryawan = async (id, newData) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.query("UPDATE user SET ? WHERE id = ?", [newData, id]);
    await conn.commit();
    return {
      status: true,
      message: "Karyawan berhasil diperbarui",
    };
  } catch (error) {
    await conn.rollback();
    return {
      status: false,
      message: error.message,
    };
  } finally {
    conn.release();
  }
};

const deleteKaryawan = async (id) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.query("DELETE FROM user WHERE id = ?", [id]);
    return {
      status: true,
      message: "Karyawan berhasil dihapus",
    };
  } catch (error) {
    await conn.rollback();
    if (
      error.code === "ER_ROW_IS_REFERENCED" ||
      error.code === "ER_NO_REFERENCED_ROW" ||
      error.errno === 1451 ||
      error.sqlMessage?.includes("foreign key constraint fails")
    ) {
      return {
        status: false,
        message: "Karyawan sedang dipakai dan tidak dapat dihapus",
      };
    }

    return {
      status: false,
      message: error.message,
    };
  } finally {
    conn.release();
  }
};

module.exports = {
  findByUsername,
  findByRole,
  ubahPassword,
  getKaryawan,
  createKaryawan,
  updateKaryawan,
  deleteKaryawan,
};
