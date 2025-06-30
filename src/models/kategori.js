const dbPool = require("../config/db.js");

const getAllKategori = async () => {
  const query = "SELECT id, nama, stok_minimal FROM kategori";
  const [rows] = await dbPool.query(query);
  return rows;
};

const createKategori = async (nama, stok_minimal) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "INSERT INTO kategori (nama, stok_minimal) VALUES (?, ?)";
    await conn.query(query, [nama, stok_minimal]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menambahkan kategori",
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

const updateKategori = async (id, nama, stok_minimal) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "UPDATE kategori SET nama = ?, stok_minimal = ? WHERE id = ?";
    await conn.query(query, [nama, stok_minimal, id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil memperbarui kategori",
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

const deleteKategori = async (id) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    const query = "DELETE FROM kategori WHERE id = ?";
    await conn.query(query, [id]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menghapus kategori",
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
        message: "Kategori sedang dipakai dan tidak dapat dihapus",
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

const getKategoriTerlaris = async (filter) => {
  let query = "";
  const baseSelect = `
    SELECT
        k.nama,
        SUM(dp.jumlah_barang) AS total_terjual,
        SUM(dp.subtotal) AS total_penjualan
    FROM
        detail_penjualan AS dp
    INNER JOIN
        barang AS b ON dp.kode_barang = b.kode_barang
    INNER JOIN
        kategori AS k ON b.id_kategori = k.id
    INNER JOIN
        penjualan AS p ON dp.no_penjualan = p.no_penjualan
    WHERE
        p.is_retur = 0 AND `;

  const closingQuery = `
    GROUP BY
        k.id, k.nama
    ORDER BY
        total_terjual DESC 
    LIMIT 5`;

  switch (filter) {
    case "harian":
      query = `${baseSelect} DATE(p.tanggal) = CURDATE() ${closingQuery}`;
      break;
    case "mingguan":
      query = `${baseSelect} YEARWEEK(p.tanggal, 1) = YEARWEEK(CURDATE(), 1) ${closingQuery}`;
      break;
    case "bulanan":
      query = `${baseSelect} YEAR(p.tanggal) = YEAR(CURDATE()) AND MONTH(p.tanggal) = MONTH(CURDATE()) ${closingQuery}`;
      break;
    case "tahunan":
      query = `${baseSelect} YEAR(p.tanggal) = YEAR(CURDATE()) ${closingQuery}`;
      break;
    default:
      throw new Error("Filter untuk kategori terlaris tidak valid.");
  }

  const [rows] = await dbPool.query(query);
  return rows;
};

module.exports = {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  getKategoriTerlaris
};
