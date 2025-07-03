const barangModel = require("../models/barang");
const excelJS = require("exceljs");
const path = require("path");

const getAllBarangKasir = async (req, res) => {
  try {
    const barang = await barangModel.getAllBarangKasir();
    return res.status(200).json({
      status: "success",
      message: "Data barang kasir berhasil diambil",
      data: {
        barang,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getAllBarangAdmin = async (req, res) => {
  try {
    const barang = await barangModel.getAllBarangAdmin();
    return res.status(200).json({
      status: "success",
      message: "Data barang admin berhasil diambil",
      data: {
        barang,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getBarangByKode = async (req, res) => {
  const { kode_barang } = req.params;
  try {
    const barang = await barangModel.getBarangByKode(kode_barang);
    return res.status(200).json({
      status: "success",
      message: "Data barang berhasil diambil",
      data: {
        barang,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBarangByKodePembelian = async (req, res) => {
  const { kode_barang } = req.params;
  try {
    const barang = await barangModel.getBarangByKodePembelian(kode_barang);
    return res.status(200).json({
      status: "success",
      message: "Data barang berhasil diambil",
      data: {
        barang,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBarangByKodeEksporBarcode = async (req, res) => {
  const { kode_barang } = req.params;
  try {
    const barang = await barangModel.getBarangByKodeEksporBarcode(kode_barang);
    if (barang.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Barang tidak ditemukan",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Data barang berhasil diambil",
      data: {
        barang,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const exportExcel = async (req, res) => {
  const barang = req.body;
  try {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [
      { header: "kode_barang", key: "kode_barang", width: 20 },
      { header: "nama_barang", key: "nama_barang", width: 30 },
      { header: "harga_barang", key: "harga_barang", width: 20 },
      { header: "kode_supplier", key: "kode_supplier", width: 20 },
      { header: "jumlah_cetak", key: "jumlah_cetak", width: 20 },
    ];

    barang.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "data_barcode.xlsx"
    );

    const buffer = await workbook.xlsx.writeBuffer();
    return res.status(200).send(buffer);

  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan saat mengekspor data",
      error: error.message,
    });
  }
};

const getTotalBarang = async (req, res) => {
  try {
    const result = await barangModel.getTotalBarang();
    return res.status(200).json({
      status: "success",
      message: "Total barang berhasil diambil",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getBarangStokMenipis = async (req, res) => {
  try {
    const barang = await barangModel.getBarangStokMenipis();
    return res.status(200).json({
      status: "success",
      message: "Data barang stok menipis berhasil diambil",
      data: barang,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
};

const getBarangTerlaris = async (req, res) => {
  const { filter } = req.params;
  try {
    const barang = await barangModel.getBarangTerlaris(filter);
    return res.status(200).json({
      status: "success",
      message: "Data barang terlaris berhasil diambil",
      data: barang,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBarangKasir,
  getAllBarangAdmin,
  getBarangByKode,
  getBarangByKodePembelian,
  getBarangByKodeEksporBarcode,
  exportExcel,
  getTotalBarang,
  getBarangStokMenipis,
  getBarangTerlaris,
};
