const dbPool = require("../config/db.js");
const dayjs = require("dayjs");

const getReturPenjualanByTahun = async (tahun) => {
  const [rows] = await dbPool.query(
    `SELECT 
      no_retur_penjualan, 
      no_penjualan, 
      tanggal, 
      total 
    FROM retur_penjualan 
    WHERE 
      YEAR(tanggal) = ? 
    ORDER BY no_retur_penjualan DESC`,
    [tahun]
  );
  return rows;
};

const getReturPenjualanByNo = async (no_retur_penjualan) => {
  const [returPenjualan] = await dbPool.query(
    "SELECT no_retur_penjualan, no_penjualan, tanggal, total FROM retur_penjualan WHERE no_retur_penjualan = ?",
    [no_retur_penjualan]
  );

  const [detailReturPenjualan] = await dbPool.query(
    `SELECT 
      drp.kode_barang, 
      b.nama AS nama_barang, 
      drp.jumlah, 
      drp.subtotal, 
      drp.alasan, 
      drp.status 
    FROM detail_retur_penjualan drp 
      JOIN barang b ON drp.kode_barang = b.kode_barang 
    WHERE no_retur_penjualan = ?`,
    [no_retur_penjualan]
  );
  return {
    retur_penjualan: returPenjualan[0],
    detail_retur_penjualan: detailReturPenjualan,
  };
};

const getNoReturPenjualan = async () => {
  const today = dayjs().format("YYMMDD");
  const prefix = `RP-${today}`;
  const query =
    "SELECT no_retur_penjualan FROM retur_penjualan WHERE no_retur_penjualan LIKE ? ORDER BY no_retur_penjualan DESC LIMIT 1";
  const [rows] = await dbPool.query(query, [`${prefix}-%`]);

  let nextNumber = "001";

  if (rows.length > 0) {
    const lastNo = rows[0].no_retur_penjualan;
    const lastNum = parseInt(lastNo.split("-")[2]);
    nextNumber = String(lastNum + 1).padStart(3, "0");
  }

  return `${prefix}-${nextNumber}`;
};

const createReturPenjualan = async (
  no_retur_penjualan,
  no_penjualan,
  tanggal,
  total,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert data retur penjualan
    await conn.query(
      "INSERT INTO retur_penjualan (no_retur_penjualan, no_penjualan, tanggal, total) VALUES (?, ?, ?, ?)",
      [no_retur_penjualan, no_penjualan, tanggal, total]
    );

    for (const item of barang) {
      // Insert data detail retur penjualan
      await conn.query(
        "INSERT INTO detail_retur_penjualan (no_retur_penjualan, kode_barang, jumlah, subtotal, alasan, status) VALUES (?, ?, ?, ?, ?, ?)",
        [
          no_retur_penjualan,
          item.kode_barang,
          item.jumlah,
          item.subtotal,
          item.alasan,
          item.status,
        ]
      );
      // Kembalikan stok barang
      await conn.query(
        "UPDATE barang SET stok = stok + ? WHERE kode_barang = ?",
        [item.jumlah, item.kode_barang]
      );

      // Update status is_retur pada penjualan
      await conn.query(
        "UPDATE penjualan SET is_retur = 1 WHERE no_penjualan = ?",
        [no_penjualan]
      );
    }

    await conn.commit();

    return {
      status: true,
      message: "Berhasil meretur penjualan",
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

const returPenjualanModel = {
  getReturPenjualanByTahun,
  getReturPenjualanByNo,
  getNoReturPenjualan,
  createReturPenjualan,
};

module.exports = returPenjualanModel;
