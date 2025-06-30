const dbPool = require("../config/db.js");
const dayjs = require("dayjs");

const getBarangRusakByTahun = async (tahun) => {
  const [rows] = await dbPool.query(
    `SELECT 
      br.no_barang_rusak, 
      s.nama, 
      br.tanggal, 
      br.total_harga_barang_rusak 
    FROM barang_rusak br 
      JOIN supplier s ON br.id_supplier = s.id 
    WHERE 
      YEAR(tanggal) = ? 
    ORDER BY br.no_barang_rusak DESC`,
    [tahun]
  );
  return rows;
};

const getBarangRusakByNo = async (no_barang_rusak) => {
  const [barangRusak] = await dbPool.query(
    "SELECT no_barang_rusak, id_supplier, tanggal FROM barang_rusak WHERE no_barang_rusak = ?",
    [no_barang_rusak]
  );
  const [detailBarangRusak] = await dbPool.query(
    "SELECT dbr.kode_barang, dbr.no_pembelian, dbr.harga_beli_saat_rusak, b.nama, b.stok, dbr.jumlah, dbr.keterangan, dbr.bisa_dikembalikan, dbr.sudah_dikembalikan FROM detail_barang_rusak dbr JOIN barang b ON dbr.kode_barang = b.kode_barang WHERE no_barang_rusak = ?",
    [no_barang_rusak]
  );
  return {
    barangRusak: barangRusak[0],
    detailBarangRusak,
  };
};

const getNoBarangRusak = async () => {
  const today = dayjs().format("YYMMDD");
  const prefix = `BR-${today}`;

  const [result] = await dbPool.query(
    "SELECT no_barang_rusak FROM barang_rusak WHERE no_barang_rusak LIKE ? ORDER BY no_barang_rusak DESC LIMIT 1",
    [`${prefix}-%`]
  );

  let nextNumber = "001";

  if (result.length > 0) {
    const lastNo = result[0].no_barang_rusak;
    const lastNum = parseInt(lastNo.split("-")[2]);
    nextNumber = String(lastNum + 1).padStart(3, "0");
  }

  return `${prefix}-${nextNumber}`;
};

const createBarangRusak = async (
  no_barang_rusak,
  id_supplier,
  tanggal,
  total_harga_barang_rusak,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    conn.beginTransaction();

    await conn.query(
      "INSERT INTO barang_rusak (no_barang_rusak, id_supplier, tanggal, total_harga_barang_rusak) VALUES (?, ?, ?, ?)",
      [no_barang_rusak, id_supplier, tanggal, total_harga_barang_rusak]
    );

    for (const item of barang) {
      await conn.query(
        "INSERT INTO detail_barang_rusak (no_barang_rusak, kode_barang, no_pembelian, jumlah, harga_beli_saat_rusak, keterangan, bisa_dikembalikan, sudah_dikembalikan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          no_barang_rusak,
          item.kode_barang,
          item.no_pembelian,
          item.jumlah,
          item.harga_beli_saat_rusak,
          item.keterangan,
          item.bisa_dikembalikan,
          false,
        ]
      );
      if (item.bisa_dikembalikan === false) {
        await conn.query(
          "UPDATE barang SET stok = stok - ? WHERE kode_barang = ?",
          [item.jumlah, item.kode_barang]
        );
      }
    }
    await conn.commit();
    return {
      status: true,
      message: "Barang rusak berhasil ditambahkan",
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

const updateBarangRusak = async (
  no_barang_rusak,
  tanggal,
  total_harga_barang_rusak,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    conn.beginTransaction();

    const [detail_lama] = await conn.query(
      "SELECT kode_barang, jumlah FROM detail_barang_rusak WHERE bisa_dikembalikan = false AND no_barang_rusak = ?",
      [no_barang_rusak]
    );

    for (const { kode_barang, jumlah } of detail_lama) {
      await conn.query(
        "UPDATE barang SET stok = stok + ? WHERE kode_barang = ?",
        [jumlah, kode_barang]
      );
    }

    await conn.query(
      "DELETE FROM detail_barang_rusak WHERE no_barang_rusak = ?",
      [no_barang_rusak]
    );

    for (const item of barang) {
      await conn.query(
        "INSERT INTO detail_barang_rusak (no_barang_rusak, kode_barang, no_pembelian, jumlah, harga_beli_saat_rusak, keterangan, bisa_dikembalikan, sudah_dikembalikan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          no_barang_rusak,
          item.kode_barang,
          item.no_pembelian,
          item.jumlah,
          item.harga_beli_saat_rusak,
          item.keterangan,
          item.bisa_dikembalikan,
          item.sudah_dikembalikan,
        ]
      );

      if (item.bisa_dikembalikan === false) {
        await conn.query(
          "UPDATE barang SET stok = stok - ? WHERE kode_barang = ?",
          [item.jumlah, item.kode_barang]
        );
      }
    }

    await conn.query(
      "UPDATE barang_rusak SET tanggal = ?, total_harga_barang_rusak = ?  WHERE no_barang_rusak = ?",
      [tanggal, total_harga_barang_rusak, no_barang_rusak]
    );
    await conn.commit();
    return {
      status: true,
      message: "Barang rusak berhasil diperbarui",
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

const getDetailPembelianByKodeBarangAndSupplier = async (
  kode_barang,
  id_supplier
) => {
  const [rows] = await dbPool.query(
    `SELECT
      dp.no_pembelian,
      dp.kode_barang,
      b.nama AS nama_barang,
      dp.jumlah,
      s.nama AS satuan,
      s.jumlah_satuan,
      dp.harga_beli,
      p.tanggal AS tanggal_pembelian,
      dp.jumlah AS jumlah_pembelian
    FROM detail_pembelian dp
    JOIN pembelian p ON dp.no_pembelian = p.no_pembelian
    JOIN barang b ON dp.kode_barang = b.kode_barang
    JOIN satuan s ON dp.id_satuan = s.id
    WHERE dp.kode_barang = ? AND p.id_supplier = ?
    ORDER BY p.tanggal DESC`,
    [kode_barang, id_supplier]
  );

  return rows;
};

const barangRusakModel = {
  getBarangRusakByTahun,
  getBarangRusakByNo,
  getNoBarangRusak,
  createBarangRusak,
  updateBarangRusak,
  getDetailPembelianByKodeBarangAndSupplier,
};

module.exports = barangRusakModel;
