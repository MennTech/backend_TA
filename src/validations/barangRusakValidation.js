const Joi = require("joi");

const barangRusakSchema = Joi.object({
  no_barang_rusak: Joi.string().required().messages({
    "string.base": "No Barang Rusak harus berupa string",
    "string.empty": "No Barang Rusak tidak boleh kosong",
    "any.required": "No Barang Rusak harus diisi",
  }),
  id_supplier: Joi.number().integer().required().messages({
    "number.base": "Supplier harus dipilih",
    "number.integer": "Supplier harus dipilih",
    "any.required": "Supplier harus dipilih",
  }),
  tanggal: Joi.date().required().messages({
    "date.base": "Tanggal harus berupa tanggal yang valid",
    "date.empty": "Tanggal tidak boleh kosong",
    "any.required": "Tanggal harus diisi",
  }),
  total_harga_barang_rusak: Joi.number().required().messages({
    "number.base": "Total Harga Barang Rusak harus berupa angka",
    "any.required": "Total Harga Barang Rusak harus diisi",
  }),
  barang: Joi.array()
    .items(
      Joi.object({
        kode_barang: Joi.number().required().messages({
          "number.base": "Kode Barang harus berupa angka",
          "number.integer": "Kode Barang harus berupa angka bulat",
          "any.required": "Kode Barang harus diisi",
        }),
        no_pembelian: Joi.string().required().messages({
          "string.base": "No Pembelian harus berupa string",
          "string.empty": "No Pembelian tidak boleh kosong",
          "any.required": "No Pembelian harus diisi",
        }),
        jumlah: Joi.number().integer().min(1).required().messages({
          "number.base": "Jumlah harus berupa angka",
          "number.integer": "Jumlah harus berupa angka bulat",
          "number.min": "Jumlah minimal 1",
          "any.required": "Jumlah harus diisi",
        }),
        harga_beli_saat_rusak: Joi.number().required().messages({
          "number.base": "Harga Beli Saat Rusak harus berupa angka",
          "any.required": "Harga Beli Saat Rusak harus diisi",
        }),
        keterangan: Joi.string().required().messages({
          "string.base": "Keterangan harus berupa string",
          "string.empty": "Keterangan tidak boleh kosong",
          "any.required": "Keterangan harus diisi",
        }),
        bisa_dikembalikan: Joi.boolean().required().messages({
          "boolean.base": "Bisa Dikembalikan harus berupa boolean",
          "any.required": "Bisa Dikembalikan harus diisi",
        }),
        sudah_dikembalikan: Joi.boolean().default(false).messages({
          "boolean.base": "Sudah Dikembalikan harus berupa boolean",
          "any.required": "Sudah Dikembalikan harus diisi",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Barang harus berupa array",
      "array.min": "Minimal terdapat 1 barang",
      "any.required": "Barang harus diisi",
    }),
});

module.exports = barangRusakSchema;
