const dbPool = require("../config/db");
const dayjs = require("dayjs");

const getNoPembelian = async () => {
  const today = dayjs().format("YYMMDD");
  const prefix = `PB-${today}`;
  const query =
    "SELECT no_pembelian FROM pembelian WHERE no_pembelian LIKE ? ORDER BY no_pembelian DESC LIMIT 1";

  const [rows] = await dbPool.query(query, [`${prefix}-%`]);

  let nextNumber = "001";

  if (rows.length > 0) {
    const lastNo = rows[0].no_pembelian;
    const lastNum = parseInt(lastNo.split("-")[2]);
    nextNumber = String(lastNum + 1).padStart(3, "0");
  }

  return `${prefix}-${nextNumber}`;
};

const getPembelianByTahun = async (tahun) => {
  const query = `SELECT 
    pb.no_pembelian, 
    s.nama, 
    pb.tanggal, 
    pb.total_harga, 
    pb.lunas 
  FROM pembelian pb 
  JOIN supplier s ON pb.id_supplier = s.id 
  WHERE 
    YEAR(tanggal) = ? 
  ORDER BY 
    pb.no_pembelian DESC`;
  const [rows] = await dbPool.query(query, [tahun]);
  return rows;
};

const getPembelianByNo = async (no_pembelian) => {
  const queryPembelian =
    "SELECT no_pembelian, id_supplier, tanggal, lunas FROM pembelian WHERE no_pembelian = ?";
  const queryDetailPembelian = `SELECT 
    dp.kode_barang, b.nama, 
    b.id_kategori, dp.id_satuan, 
    dp.jumlah, dp.harga_beli, 
    dp.harga_jual, dp.harga_grosir, 
    dp.subtotal 
  FROM detail_pembelian dp 
    JOIN barang b ON dp.kode_barang = b.kode_barang 
  WHERE dp.no_pembelian = ?`;
  const [pembelianRows] = await dbPool.query(queryPembelian, [no_pembelian]);
  const [detailRows] = await dbPool.query(queryDetailPembelian, [no_pembelian]);

  return {
    pembelian: pembelianRows[0],
    detailPembelian: detailRows,
  };
};

const createPembelian = async (
  no_pembelian,
  id_supplier,
  tanggal,
  total_harga,
  lunas,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    const queryPembelian =
      "INSERT INTO pembelian (no_pembelian, id_supplier, tanggal, total_harga, lunas) VALUES (?, ?, ?, ?, ?)";
    await conn.query(queryPembelian, [
      no_pembelian,
      id_supplier,
      tanggal,
      total_harga,
      lunas,
    ]);

    const queryBarang =
      "INSERT INTO barang (kode_barang, id_kategori, nama, stok, harga_beli, harga_jual, harga_grosir) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const queryUpdateHarga =
      "UPDATE barang SET harga_beli = ?, harga_jual = ?, harga_grosir = ? WHERE kode_barang = ?";
    const queryDetailPembelian =
      "INSERT INTO detail_pembelian (no_pembelian, kode_barang, id_satuan, jumlah, harga_beli, harga_jual, harga_grosir, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const queryStok = "UPDATE barang SET stok = stok + ? WHERE kode_barang = ?";
    const queryJumlahSatuan = "SELECT jumlah_satuan FROM satuan WHERE id = ?";

    for (const item of barang) {
      // Masukkan barang baru jika is_new = true
      if (item.is_new) {
        await conn.query(queryBarang, [
          item.kode_barang,
          item.id_kategori,
          item.nama,
          0,
          item.pcs_beli,
          item.harga_jual,
          item.harga_grosir,
        ]);
      } else {
        // Ambil harga beli lama terlebih dahulu
        const [barangLama] = await conn.query(
          "SELECT harga_beli FROM barang WHERE kode_barang = ?",
          [item.kode_barang]
        );
        const hargaBeliLama = barangLama[0].harga_beli;

        // Bandingkan harga beli baru dengan harga beli lama
        if (item.pcs_beli > hargaBeliLama) {
          // Jika lebih besar, update harga beli
          await conn.query(
            "UPDATE barang SET harga_beli = ?, harga_jual = ?, harga_grosir = ? WHERE kode_barang = ?",
            [
              item.pcs_beli,
              item.harga_jual,
              item.harga_grosir,
              item.kode_barang,
            ]
          );
        }
      }

      // Masukkan detail pembelian
      await conn.query(queryDetailPembelian, [
        no_pembelian,
        item.kode_barang,
        item.id_satuan,
        item.jumlah,
        item.harga_beli,
        item.harga_jual,
        item.harga_grosir,
        item.subtotal,
      ]);

      // Ambil jumlah satuan dari tabel satuan
      const [result] = await conn.query(queryJumlahSatuan, [item.id_satuan]);

      // Hitung jumlah barang berdasarkan satuan
      const jumlahSatuan = result[0].jumlah_satuan;
      const totalStokBaru = item.jumlah * jumlahSatuan;

      // Update stok barang
      await conn.query(queryStok, [totalStokBaru, item.kode_barang]);
    }
    await conn.commit();
    return {
      status: true,
      message: "Berhasil menambahkan data pembelian",
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

const updatePembelian = async (
  no_pembelian,
  id_supplier,
  tanggal,
  total_harga,
  lunas,
  barang
) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();

    // Ambil data detail pembelian lama
    const [detail_lama] = await conn.query(
      "SELECT dp.kode_barang, dp.jumlah, s.jumlah_satuan FROM detail_pembelian dp JOIN satuan s ON dp.id_satuan = s.id WHERE no_pembelian = ?",
      [no_pembelian]
    );

    // Kurangi stok barang terlebih dahulu
    for (const { kode_barang, jumlah, jumlah_satuan } of detail_lama) {
      const pengurang = jumlah * jumlah_satuan;
      await conn.query(
        "UPDATE barang SET stok = stok - ? WHERE kode_barang = ?",
        [pengurang, kode_barang]
      );
    }

    // Hapus detail pembelian lama
    await conn.query("DELETE FROM detail_pembelian WHERE no_pembelian = ?", [
      no_pembelian,
    ]);

    for (const item of barang) {
      // Masukkan barang baru jika is_new = true
      if (item.is_new) {
        await conn.query(
          "INSERT INTO barang (kode_barang, id_kategori, nama, stok, harga_beli, harga_jual, harga_grosir) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            item.kode_barang,
            item.id_kategori,
            item.nama,
            0,
            item.pcs_beli,
            item.harga_jual,
            item.harga_grosir,
          ]
        );
      } else {
        // Ambil harga beli lama terlebih dahulu
        const [barangLama] = await conn.query(
          "SELECT harga_beli FROM barang WHERE kode_barang = ?",
          [item.kode_barang]
        );
        const hargaBeliLama = barangLama[0].harga_beli;

        // Bandingkan harga beli baru dengan harga beli lama
        if (item.pcs_beli > hargaBeliLama) {
          // Jika lebih besar, update harga beli
          await conn.query(
            "UPDATE barang SET harga_beli = ?, harga_jual = ?, harga_grosir = ? WHERE kode_barang = ?",
            [
              item.pcs_beli,
              item.harga_jual,
              item.harga_grosir,
              item.kode_barang,
            ]
          );
        }
      }

      // Masukkan detail pembelian baru
      await conn.query(
        "INSERT INTO detail_pembelian (no_pembelian, kode_barang, id_satuan, jumlah, harga_beli, harga_jual, harga_grosir, subtotal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          no_pembelian,
          item.kode_barang,
          item.id_satuan,
          item.jumlah,
          item.harga_beli,
          item.harga_jual,
          item.harga_grosir,
          item.subtotal,
        ]
      );

      // Ambil jumlah satuan dari tabel satuan
      const [result] = await conn.query(
        "SELECT jumlah_satuan FROM satuan WHERE id = ?",
        [item.id_satuan]
      );

      // Hitung jumlah barang berdasarkan satuan
      const jumlahSatuan = result[0].jumlah_satuan;
      const totalStokBaru = item.jumlah * jumlahSatuan;

      // Update stok barang
      await conn.query(
        "UPDATE barang SET stok = stok + ? WHERE kode_barang = ?",
        [totalStokBaru, item.kode_barang]
      );
    }

    // Update data pembelian
    await conn.query(
      "UPDATE pembelian SET id_supplier = ?, tanggal = ?, total_harga =? , lunas = ? WHERE no_pembelian = ?",
      [id_supplier, tanggal, total_harga, lunas, no_pembelian]
    );

    await conn.commit();
    return {
      status: true,
      message: "Berhasil mengupdate data pembelian",
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

const pelunasanHutang = async (no_pembelian) => {
  const conn = await dbPool.getConnection();
  try {
    await conn.beginTransaction();
    conn.query("UPDATE pembelian SET lunas = ? WHERE no_pembelian = ?", [
      1,
      no_pembelian,
    ]);
    await conn.commit();
    return {
      status: true,
      message: "Berhasil melunasi hutang",
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

const pembelianModel = {
  getNoPembelian,
  getPembelianByTahun,
  getPembelianByNo,
  createPembelian,
  updatePembelian,
  pelunasanHutang,
};

module.exports = pembelianModel;
