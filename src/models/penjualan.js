const dbPool = require("../config/db.js");
const dayjs = require("dayjs");

const getNoPenjualan = async () => {
  const today = dayjs().format("YYMMDD");
  const prefix = `PJ-${today}`;

  const query =
    "SELECT no_penjualan FROM penjualan WHERE no_penjualan LIKE ? ORDER BY no_penjualan DESC LIMIT 1";
  const [rows] = await dbPool.query(query, [`${prefix}-%`]);

  let nextNumber = "001";

  if (rows.length > 0) {
    const lastNo = rows[0].no_penjualan;
    const lastNum = parseInt(lastNo.split("-")[2]);
    nextNumber = String(lastNum + 1).padStart(3, "0");
  }

  return `${prefix}-${nextNumber}`;
};

const getPenjualan = async (tahun, bulan) => {
  let whereClause = "WHERE 1=1";
  const params = [];

  if (tahun && bulan) {
    whereClause += " AND YEAR(tanggal) = ? AND MONTH(tanggal) = ?";
    params.push(tahun, bulan);
  } else if (tahun) {
    whereClause += " AND YEAR(tanggal) = ?";
    params.push(tahun);
  }

  const query = `
    SELECT 
      p.no_penjualan, 
      u.username AS username,
      p.tanggal, 
      p.total_harga, 
      p.metode_pembayaran, 
      p.jumlah_bayar, 
      p.kembalian,
      p.is_retur,
      SUM(dp.jumlah_barang) AS total_item,
      SUM(dp.potongan) AS total_potongan
    FROM penjualan p
    JOIN user u ON p.id_user = u.id
    LEFT JOIN detail_penjualan dp ON p.no_penjualan = dp.no_penjualan
    ${whereClause}
    GROUP BY p.no_penjualan
    ORDER BY p.no_penjualan DESC`;

  const [rows] = await dbPool.query(query, [...params]);

  return {
    status: true,
    message: "Berhasil mendapatkan data penjualan",
    data: rows,
  };
};

const getPenjualanByNo = async (no_penjualan) => {
  const penjualan = await dbPool.query(
    `SELECT 
      no_penjualan, 
      tanggal, 
      total_harga, 
      metode_pembayaran, 
      jumlah_bayar, 
      kembalian, 
      is_retur 
    FROM penjualan 
    WHERE no_penjualan = ?`,
    [no_penjualan]
  );
  const detailPenjualan = await dbPool.query(
    `SELECT 
      dp.kode_barang, 
      b.nama, 
      dp.jumlah_barang, 
      dp.harga_jual, 
      dp.potongan, 
      dp.subtotal 
    FROM detail_penjualan dp 
      JOIN barang b ON dp.kode_barang = b.kode_barang 
    WHERE no_penjualan = ?`,
    [no_penjualan]
  );

  return {
    status: true,
    message: "Berhasil mendapatkan data penjualan",
    data: {
      penjualan: penjualan[0],
      detail_penjualan: detailPenjualan[0],
    },
  };
};

const createPenjualan = async (
  no_penjualan,
  id_user,
  tanggal,
  total_harga,
  metode_pembayaran,
  jumlah_bayar,
  kembalian,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    conn.beginTransaction();

    // Insert data penjualan
    await conn.query(
      "INSERT INTO penjualan (no_penjualan, id_user, tanggal, total_harga, metode_pembayaran, jumlah_bayar, kembalian, is_retur) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        no_penjualan,
        id_user,
        tanggal,
        total_harga,
        metode_pembayaran,
        jumlah_bayar,
        kembalian,
        false,
      ]
    );

    // Insert data detail penjualan
    for (const item of barang) {
      await conn.query(
        "INSERT INTO detail_penjualan (no_penjualan, kode_barang, jumlah_barang, harga_jual, potongan, subtotal) VALUES (?, ?, ?, ?, ?, ?)",
        [
          no_penjualan,
          item.kode_barang,
          item.jumlah_barang,
          item.harga_jual,
          item.potongan,
          item.subtotal,
        ]
      );

      // Kurangi stok barang
      await conn.query(
        "UPDATE barang SET stok = stok - ? WHERE kode_barang = ?",
        [item.jumlah_barang, item.kode_barang]
      );
    }

    await conn.commit();
    return {
      status: true,
      message: "Berhasil menambah data penjualan",
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

const getJumlahTransaksiPenjualan = async () => {
  const [rows] = await dbPool.query(
    "SELECT COUNT(*) AS total FROM penjualan WHERE DATE(tanggal) = CURDATE()"
  );
  return rows[0].total;
};

const getPendapatanHariIni = async () => {
  const [rows] = await dbPool.query(
    "SELECT COALESCE(SUM(total_harga),0) AS pendapatan_hari_ini FROM penjualan WHERE DATE(tanggal) = CURDATE()"
  );
  return rows[0].pendapatan_hari_ini;
};

const getPendapatanByFilter = async (filter) => {
  let query = "";
  const baseQuery = `
    FROM
        detail_penjualan AS dp
    INNER JOIN
        penjualan AS p ON dp.no_penjualan = p.no_penjualan
    WHERE
        p.is_retur = 0 AND `;

  switch (filter) {
    case "harian":
      query = `
        SELECT
            DATE_FORMAT(p.tanggal, '%H:00') AS label,
            SUM(dp.subtotal) AS data
        ${baseQuery}
            DATE(p.tanggal) = CURDATE()
        GROUP BY
            label
        ORDER BY
            label ASC;`;
      break;

    case "mingguan":
      query = `
        SELECT
            DAYNAME(p.tanggal) AS label,
            SUM(dp.subtotal) AS data
        ${baseQuery}
            YEARWEEK(p.tanggal, 1) = YEARWEEK(CURDATE(), 1)
        GROUP BY
            WEEKDAY(p.tanggal), label
        ORDER BY
            WEEKDAY(p.tanggal) ASC;`;
      break;

    case "bulanan":
      query = `
        SELECT
            DATE_FORMAT(p.tanggal, '%d %b') AS label,
            SUM(dp.subtotal) AS data
        ${baseQuery}
            YEAR(p.tanggal) = YEAR(CURDATE()) AND MONTH(p.tanggal) = MONTH(CURDATE())
        GROUP BY
            label
        ORDER BY
            label ASC;`;
      break;

    case "tahunan":
      query = `
        SELECT
            MONTHNAME(p.tanggal) AS label,
            SUM(dp.subtotal) AS data
        ${baseQuery}
            YEAR(p.tanggal) = YEAR(CURDATE())
        GROUP BY
            MONTH(p.tanggal), label
        ORDER BY
            MONTH(p.tanggal) ASC;`;
      break;

    default:
      throw new Error("Filter tidak valid");
  }

  const [rows] = await dbPool.query(query);
  return {
    status: true,
    message: "Berhasil mendapatkan pendapatan",
    data: rows,
  };
};

module.exports = {
  getNoPenjualan,
  getPenjualan,
  getPenjualanByNo,
  createPenjualan,
  getJumlahTransaksiPenjualan,
  getPendapatanHariIni,
  getPendapatanByFilter,
};
