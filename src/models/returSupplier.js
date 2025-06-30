const dbPool = require("../config/db.js");
const dayjs = require("dayjs");

const getNoReturSupplier = async () => {
  const today = dayjs().format("YYMMDD");
  const prefix = `RS-${today}`;

  const [rows] = await dbPool.query(
    "SELECT no_retur_supplier FROM retur_supplier WHERE no_retur_supplier LIKE ? ORDER BY no_retur_supplier DESC LIMIT 1",
    [`${prefix}-%`]
  );

  let nextNumber = "001";

  if (rows.length > 0) {
    const lastNo = rows[0].no_retur_supplier;
    const lastNum = parseInt(lastNo.split("-")[2]);
    nextNumber = String(lastNum + 1).padStart(3, "0");
  }

  return `${prefix}-${nextNumber}`;
};

const getReturSupplierByTahun = async (tahun) => {
  const [rows] = await dbPool.query(
    `SELECT 
      rs.no_retur_supplier, 
      s.nama, 
      rs.tanggal, 
      rs.keterangan 
    FROM retur_supplier rs 
      JOIN supplier s ON rs.id_supplier = s.id 
    WHERE YEAR(rs.tanggal) = ? 
    ORDER BY rs.no_retur_supplier DESC`,
    [tahun]
  );
  return rows;
};

const getDetailReturSupplier = async (no_retur_supplier) => {
  const [returSupplier] = await dbPool.query(
    `SELECT 
      s.nama, 
      rs.tanggal, 
      rs.keterangan 
    FROM retur_supplier rs 
      JOIN supplier s ON rs.id_supplier = s.id 
    WHERE no_retur_supplier = ?`,
    [no_retur_supplier]
  );

  const [detailReturSupplier] = await dbPool.query(
    `SELECT 
      drs.kode_barang, 
      b.nama AS nama_barang, 
      drs.jumlah, 
      drs.status, 
      drs.no_barang_rusak 
    FROM detail_retur_supplier drs 
      JOIN barang b ON drs.kode_barang = b.kode_barang 
    WHERE drs.no_retur_supplier = ?`,
    [no_retur_supplier]
  );
  return {
    retur_supplier: returSupplier[0],
    detail_retur_supplier: detailReturSupplier,
  };
};

const getBarangRusakBySupplier = async (id_supplier) => {
  const [rows] = await dbPool.query(
    `SELECT 
      br.no_barang_rusak, 
      dbr.kode_barang, 
      b.nama AS nama_barang, 
      dbr.jumlah, 
      dbr.keterangan
    FROM barang_rusak br 
    JOIN detail_barang_rusak dbr ON br.no_barang_rusak = dbr.no_barang_rusak
    JOIN barang b ON dbr.kode_barang = b.kode_barang
    WHERE 
      dbr.bisa_dikembalikan = true 
      AND dbr.sudah_dikembalikan = false
      AND br.id_supplier = ?`,
    [id_supplier]
  );

  return rows;
};

const createReturSupplier = async (
  no_retur_supplier,
  id_supplier,
  tanggal,
  keterangan,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    conn.beginTransaction();

    // Insert data retur supplier
    await conn.query(
      "INSERT INTO retur_supplier (no_retur_supplier, id_supplier, tanggal, keterangan) VALUES (?, ?, ?, ?)",
      [no_retur_supplier, id_supplier, tanggal, keterangan]
    );

    // Insert data detail retur supplier
    for (const item of barang) {
      // Ambil jumlah barang rusak yang ada
      const [rows] = await conn.query(
        "SELECT jumlah FROM detail_barang_rusak WHERE no_barang_rusak = ? AND kode_barang = ?",
        [item.no_barang_rusak, item.kode_barang]
      );
      const jumlahRusak = rows[0]?.jumlah ?? 0;

      await conn.query(
        "INSERT INTO detail_retur_supplier (no_retur_supplier, kode_barang, no_barang_rusak, jumlah, status) VALUES (?, ?, ?, ?, ?)",
        [
          no_retur_supplier,
          item.kode_barang,
          item.no_barang_rusak,
          item.jumlah,
          item.status,
        ]
      );

      // Update status bisa_dikembalikan detail barang rusak
      await conn.query(
        "UPDATE detail_barang_rusak SET sudah_dikembalikan = true WHERE no_barang_rusak = ? AND kode_barang = ?",
        [item.no_barang_rusak, item.kode_barang]
      );

      // Jika status potong nota, kurangi stok barang
      if (item.status === "potong-nota") {
        await conn.query(
          "UPDATE barang SET stok = stok - ? WHERE kode_barang = ?",
          [item.jumlah, item.kode_barang]
        );
      }
    }
    await conn.commit();
    return {
      status: true,
      message: "Berhasil membuat retur supplier",
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

const returSupplierModel = {
  getReturSupplierByTahun,
  getDetailReturSupplier,
  getNoReturSupplier,
  getBarangRusakBySupplier,
  createReturSupplier,
};

module.exports = returSupplierModel;
