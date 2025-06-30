const dbPool = require("../config/db.js");

const getAllSupplier = async () => {
  const query =
    "SELECT id, nama, kode_supplier, no_telpon, alamat FROM supplier";
  const [rows] = await dbPool.query(query);
  return rows;
};

const createSupplier = async (nama, kode_supplier, no_telpon, alamat) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query =
      "INSERT INTO supplier (nama, kode_supplier, no_telpon, alamat) VALUES (?, ?, ?, ?)";
    await conn.query(query, [nama, kode_supplier, no_telpon, alamat]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menambahkan Supplier",
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

const updateSupplier = async (id, nama, kode_supplier, no_telpon, alamat) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query =
      "UPDATE supplier SET nama = ?, kode_supplier = ?, no_telpon = ?, alamat = ? WHERE id = ?";
    await conn.query(query, [nama, kode_supplier, no_telpon, alamat, id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil mengupdate Supplier",
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

const deleteSupplier = async (id) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "DELETE FROM supplier WHERE id = ?";
    await conn.query(query, [id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menghapus Supplier",
    };
  } catch (error) {
    await conn.rollback();

    // Deteksi error foreign key constraint
    if (
      error.code === "ER_ROW_IS_REFERENCED" ||
      error.code === "ER_NO_REFERENCED_ROW" ||
      error.errno === 1451 ||
      error.sqlMessage?.includes("foreign key constraint fails")
    ) {
      return {
        status: false,
        message: "Supplier sedang dipakai dan tidak dapat dihapus",
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

const getJumlahSupplier = async () => {
  const [rows] = await dbPool.query("SELECT COUNT(*) AS jumlah FROM supplier");
  return rows[0].jumlah;
};

module.exports = {
  getAllSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  getJumlahSupplier,
};
