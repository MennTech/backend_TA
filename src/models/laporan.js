const dbPool = require("../config/db");

const getLaporanPenjualan = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "WHERE 1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?";
    params.push(bulan, tahun);
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
      SUM(dp.potongan) AS total_potongan
    FROM penjualan p
    JOIN user u ON p.id_user = u.id 
    LEFT JOIN detail_penjualan dp ON p.no_penjualan = dp.no_penjualan
    ${whereClause}
    GROUP BY p.no_penjualan
    ORDER BY tanggal DESC`;

  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan penjualan",
    data: rows,
  };
};

const getLaporanBarangLambatTerjual = async (
  startDate,
  endDate,
  bulan,
  tahun
) => {
  let whereClause = "1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(p.tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(p.tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(p.tanggal) = ? AND YEAR(p.tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(p.tanggal) = ?";
    params.push(tahun);
  }

  const query = `
    SELECT
      b.kode_barang,
      b.nama AS nama_barang,
      k.nama AS kategori,
      b.stok,
      b.harga_beli,
      (b.stok * b.harga_beli) AS total_nilai_modal
    FROM
        barang AS b
    LEFT JOIN
        kategori AS k ON b.id_kategori = k.id
    WHERE 
        b.stok > 0
        AND NOT EXISTS (
            SELECT 1
            FROM detail_penjualan AS dp
            INNER JOIN penjualan AS p ON dp.no_penjualan = p.no_penjualan
            WHERE
                dp.kode_barang = b.kode_barang
                AND ${whereClause}
        )
    ORDER BY
        total_nilai_modal DESC`;
  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan barang lama terjual",
    data: rows,
  };
};

const getLaporanPembelian = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "WHERE 1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND tanggal BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND tanggal = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(tanggal) = ?";
    params.push(tahun);
  }

  const query = `
    SELECT 
        p.no_pembelian,
        k.nama AS supplier,
        p.tanggal, 
        p.total_harga,
        p.lunas
    FROM pembelian p
    INNER JOIN supplier k ON p.id_supplier = k.id 
    ${whereClause}
    ORDER BY p.no_pembelian DESC
    `;

  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan pembelian",
    data: rows,
  };
};

const getLaporanUtangPembelianBelumLunas = async () => {
  const query = `
    SELECT
      p.no_pembelian,
      p.tanggal AS tanggal_pembelian,
      s.nama AS pemasok,
      p.total_harga AS jumlah_hutang,
      DATEDIFF(CURDATE(), p.tanggal) AS umur_hutang_hari
    FROM
        pembelian AS p
    INNER JOIN
        supplier AS s ON p.id_supplier = s.id
    WHERE
        p.lunas = 0
    ORDER BY
        p.tanggal ASC`;

  const [rows] = await dbPool.query(query);
  return {
    status: true,
    message: "Berhasil mendapatkan data utang pembelian belum lunas",
    data: rows,
  };
};

const getLaporanLabaKotor = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(p.tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(p.tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(p.tanggal) = ? AND YEAR(p.tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(p.tanggal) = ?";
    params.push(tahun);
  }

  const query = `
    SELECT
      p.tanggal,
      p.no_penjualan,
      b.nama AS nama_barang,
      dp.jumlah_barang,
      dp.harga_jual AS harga_jual_satuan,
      b.harga_beli AS harga_beli_satuan,
      (dp.subtotal - (dp.jumlah_barang * b.harga_beli)) AS laba_kotor
    FROM
        detail_penjualan AS dp
    INNER JOIN
        penjualan AS p ON dp.no_penjualan = p.no_penjualan
    INNER JOIN
        barang AS b ON dp.kode_barang = b.kode_barang
    WHERE
        p.is_retur = 0
        AND ${whereClause}
    ORDER BY
        p.tanggal`;
  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan laba kotor",
    data: rows,
  };
};

const getLaporanBarangRusak = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "WHERE 1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(br.tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(br.tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(br.tanggal) = ? AND YEAR(br.tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(br.tanggal) = ?";
    params.push(tahun);
  }

  const query = `
   SELECT
      br.no_barang_rusak,
      br.tanggal,
      b.nama AS nama_barang,
      dbr.jumlah,
      dbr.harga_beli_saat_rusak,
      (dbr.jumlah * dbr.harga_beli_saat_rusak) AS total_kerugian,
      s.nama AS pemasok,
      dbr.keterangan,
      dbr.no_pembelian,
      dbr.bisa_dikembalikan,
      dbr.sudah_dikembalikan
    FROM
        detail_barang_rusak AS dbr
    INNER JOIN
        barang_rusak AS br ON dbr.no_barang_rusak = br.no_barang_rusak
    INNER JOIN
        barang AS b ON dbr.kode_barang = b.kode_barang
    INNER JOIN
        supplier AS s ON br.id_supplier = s.id
    ${whereClause}
    ORDER BY
        br.tanggal DESC`;

  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan barang rusak",
    data: rows,
  };
};

const getLaporanReturSupplier = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "WHERE 1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(rs.tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(rs.tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(rs.tanggal) = ? AND YEAR(rs.tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(rs.tanggal) = ?";
    params.push(tahun);
  }

  const query = `
   SELECT
      rs.no_retur_supplier,
      rs.tanggal,
      s.nama AS pemasok,
      b.nama AS nama_barang,
      drs.jumlah,
      dbr.harga_beli_saat_rusak,
      (drs.jumlah * dbr.harga_beli_saat_rusak) AS total_nilai_retur,
      drs.status,
      drs.no_barang_rusak AS no_barang_rusak
    FROM
        detail_retur_supplier AS drs
    INNER JOIN
        retur_supplier AS rs ON drs.no_retur_supplier = rs.no_retur_supplier
    INNER JOIN
        supplier AS s ON rs.id_supplier = s.id
    INNER JOIN
        barang AS b ON drs.kode_barang = b.kode_barang
    LEFT JOIN
        detail_barang_rusak AS dbr ON drs.no_barang_rusak = dbr.no_barang_rusak AND drs.kode_barang = dbr.kode_barang
    ${whereClause}
    ORDER BY
        rs.tanggal DESC`;

  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan retur supplier",
    data: rows,
  };
};

const getLaporanReturPenjualan = async (startDate, endDate, bulan, tahun) => {
  let whereClause = "WHERE 1=1";
  const params = [];
  if (startDate && endDate) {
    whereClause += " AND DATE(rp.tanggal) BETWEEN ? AND ?";
    params.push(startDate, endDate);
  } else if (startDate) {
    whereClause += " AND DATE(rp.tanggal) = ?";
    params.push(startDate);
  } else if (bulan && tahun) {
    whereClause += " AND MONTH(rp.tanggal) = ? AND YEAR(rp.tanggal) = ?";
    params.push(bulan, tahun);
  } else if (tahun) {
    whereClause += " AND YEAR(rp.tanggal) = ?";
    params.push(tahun);
  }

  const query = `
    SELECT
      rp.no_retur_penjualan,
      rp.tanggal,
      b.nama AS nama_barang,
      drp.jumlah,
      drp.subtotal AS nilai_retur,
      drp.alasan,
      drp.status,
      rp.no_penjualan
    FROM
        detail_retur_penjualan AS drp
    INNER JOIN
        retur_penjualan AS rp ON drp.no_retur_penjualan = rp.no_retur_penjualan
    INNER JOIN
        barang AS b ON drp.kode_barang = b.kode_barang
    ${whereClause}
    ORDER BY
        rp.tanggal DESC`;

  const [rows] = await dbPool.query(query, [...params]);
  return {
    status: true,
    message: "Berhasil mendapatkan data laporan retur penjualan",
    data: rows,
  };
};

module.exports = {
  getLaporanPenjualan,
  getLaporanBarangLambatTerjual,
  getLaporanPembelian,
  getLaporanUtangPembelianBelumLunas,
  getLaporanLabaKotor,
  getLaporanBarangRusak,
  getLaporanReturSupplier,
  getLaporanReturPenjualan,
};
