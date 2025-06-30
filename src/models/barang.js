const dbPool = require("../config/db.js");

const getAllBarangKasir = async () => {
  const [rows] = await dbPool.query(
    `SELECT 
      b.kode_barang, 
      b.nama, 
      k.nama AS kategori, 
      b.stok, 
      b.harga_jual, 
      b.harga_grosir 
    FROM barang b 
      JOIN kategori k ON b.id_kategori = k.id 
    ORDER BY b.kode_barang ASC`
  );
  return rows;
};

const getAllBarangAdmin = async () => {
  const [rows] = await dbPool.query(
    `SELECT 
    b.kode_barang, 
    b.nama, 
    k.nama AS kategori, 
    b.stok, 
    b.harga_beli, 
    b.harga_jual, 
    b.harga_grosir 
    FROM barang b 
    JOIN kategori k ON b.id_kategori = k.id 
    ORDER BY b.kode_barang ASC`
  );
  return rows;
};

const getBarangByKode = async (kode_barang) => {
  const [rows] = await dbPool.query(
    "SELECT kode_barang, nama, harga_jual, harga_grosir FROM barang WHERE kode_barang = ?",
    [kode_barang]
  );
  return rows;
};

const getBarangByKodePembelian = async (kode_barang) => {
  const [rows] = await dbPool.query(
    `SELECT 
      b.kode_barang, 
      b.nama, 
      b.stok,
      b.id_kategori, 
      dp.harga_beli, 
      b.harga_jual, 
      b.harga_grosir, 
      dp.id_satuan,
      s.jumlah_satuan
    FROM barang b 
    JOIN (
      SELECT dp1.*
      FROM detail_pembelian dp1
      JOIN pembelian p1 ON dp1.no_pembelian = p1.no_pembelian
      WHERE dp1.kode_barang = ?
      ORDER BY p1.tanggal DESC
      LIMIT 1
    ) AS dp ON b.kode_barang = dp.kode_barang
    JOIN satuan s ON dp.id_satuan = s.id
    WHERE b.kode_barang = ?`,
    [kode_barang, kode_barang]
  );
  return rows;
};

const getBarangByKodeEksporBarcode = async (kode_barang) => {
  const [rows] = await dbPool.query(
  `SELECT 
    b.nama,
    b.harga_jual,
    s.kode_supplier
  FROM barang b
    JOIN supplier s ON s.id = (
      SELECT p.id_supplier
      FROM pembelian p
      JOIN detail_pembelian dp ON p.no_pembelian = dp.no_pembelian
      WHERE dp.kode_barang = b.kode_barang
      ORDER BY p.tanggal DESC
      LIMIT 1
    ) 
  WHERE b.kode_barang = ?`,
  [kode_barang]
  );

  return rows;
};

const getTotalBarang = async () => {
  const [rows] = await dbPool.query("SELECT COUNT(*) AS total FROM barang");
  return rows[0].total;
};

const getBarangStokMenipis = async () => {
  const [rows] = await dbPool.query(
    `SELECT
      b.kode_barang,
      b.nama,
      b.stok,
      (
        SELECT GROUP_CONCAT(DISTINCT s.nama SEPARATOR ', ')
        FROM pembelian AS p_inner
        INNER JOIN detail_pembelian AS dp_inner ON p_inner.no_pembelian = dp_inner.no_pembelian
        INNER JOIN supplier AS s ON p_inner.id_supplier = s.id
        WHERE dp_inner.kode_barang = b.kode_barang
      ) AS pemasok
      FROM barang b
      INNER JOIN kategori k ON k.id = b.id_kategori
      WHERE b.stok <= k.stok_minimal`
  );
  return rows;
};

const getBarangTerlaris = async (filter) => {
  let query = "";
  const baseSelect = `
    SELECT
        b.nama,
        SUM(dp.jumlah_barang) AS total_terjual,
        SUM(dp.subtotal) AS total_penjualan
    FROM
        detail_penjualan AS dp
    INNER JOIN
        barang AS b ON dp.kode_barang = b.kode_barang
    INNER JOIN
        penjualan AS p ON dp.no_penjualan = p.no_penjualan
    WHERE
        p.is_retur = 0 AND `;

  const closingQuery = `
    GROUP BY
        b.kode_barang, b.nama
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
      throw new Error("Filter untuk barang terlaris tidak valid.");
  }

  const [rows] = await dbPool.query(query);
  return rows;
};

module.exports = {
  getAllBarangKasir,
  getAllBarangAdmin,
  getBarangByKode,
  getBarangByKodePembelian,
  getBarangByKodeEksporBarcode,
  getTotalBarang,
  getBarangStokMenipis,
  getBarangTerlaris,
};
