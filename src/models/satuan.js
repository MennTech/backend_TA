const dbPool = require("../config/db.js");

const getAllSatuan = async () => {
  const query = "SELECT id, nama, jumlah_satuan FROM satuan";
  const [rows] = await dbPool.query(query);
  return rows;
};

const createSatuan = async (nama, jumlah_satuan) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "INSERT INTO satuan (nama, jumlah_satuan) VALUES (?, ?)";
    await conn.query(query, [nama, jumlah_satuan]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menambahkan satuan",
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

const updateSatuan = async (id, nama, jumlah_satuan) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "UPDATE satuan SET nama = ?, jumlah_satuan = ? WHERE id = ?";
    await conn.query(query, [nama, jumlah_satuan, id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil mengupdate satuan",
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

const deleteSatuan = async (id) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "DELETE FROM satuan WHERE id = ?";
    await conn.query(query, [id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menghapus satuan",
    };
  } catch (error) {
    await conn.rollback();

    // Deteksi error foreign ket constraint
    if (
      error.code === "ER_ROW_IS_REFERENCED" ||
      error.code === "ER_NO_REFERENCED_ROW" ||
      error.errno === 1451 ||
      error.sqlMessage?.includes("foreign key constraint fails")
    ) {
      return {
        status: false,
        message: "Satuan sedang dipakai dan tidak dapat dihapus",
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

const satuanModel = {
  getAllSatuan,
  createSatuan,
  updateSatuan,
  deleteSatuan,
};

module.exports = satuanModel;
