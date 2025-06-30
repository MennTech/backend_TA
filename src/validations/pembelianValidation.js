const Joi = require("joi");

const pembelianSchema = Joi.object({
  no_pembelian: Joi.string().required().messages({
    "string.base": "No Pembelian harus berupa string",
    "string.empty": "No Pembelian tidak boleh kosong",
    "any.required": "No Pembelian harus diisi",
  }),
  id_supplier: Joi.number().integer().required().messages({
    "number.base": "Supplier belum dipilih",
    "number.integer": "ID Supplier harus berupa angka bulat",
    "any.required": "Supplier harus dipilih",
  }),
  tanggal: Joi.date().required().messages({
    "date.base": "Tanggal harus diisi",
    "any.required": "Tanggal harus diisi",
  }),
  total_harga: Joi.number().required().messages({
    "number.base": "Total Harga harus berupa angka",
    "any.required": "Total Harga harus diisi",
  }),
  lunas: Joi.boolean().required().messages({
    "boolean.base": "Lunas harus berupa boolean",
    "any.required": "Lunas harus diisi",
  }),
  barang: Joi.array()
    .items(
      Joi.object({
        kode_barang: Joi.number().required().messages({
          "number.base": "Kode Barang tidak boleh kosong",
          "number.empty": "Kode Barang tidak boleh kosong",
          "any.required": "Kode Barang harus diisi",
        }),
        nama: Joi.string().required().messages({
          "string.base": "Nama Barang harus berupa string",
          "string.empty": "Nama Barang tidak boleh kosong",
          "any.required": "Nama Barang harus diisi",
        }),
        id_kategori: Joi.number().integer().required().messages({
          "number.base": "ID Kategori harus berupa angka",
          "number.integer": "ID Kategori harus berupa angka bulat",
          "any.required": "ID Kategori harus diisi",
        }),
        jumlah: Joi.number().required().messages({
          "number.base": "Jumlah harus berupa angka",
          "number.empty": "Jumlah tidak boleh kosong",
          "any.required": "Jumlah harus diisi",
        }),
        id_satuan: Joi.number().integer().required().messages({
          "number.base": "ID Satuan harus berupa angka",
          "number.integer": "ID Satuan harus berupa angka bulat",
          "any.required": "ID Satuan harus diisi",
        }),
        harga_beli: Joi.number().required().messages({
          "number.base": "Harga Beli harus berupa angka",
          "number.empty": "Harga Beli tidak boleh kosong",
          "any.required": "Harga Beli harus diisi",
        }),
        pcs_beli: Joi.number().required().messages({
          "number.base": "Pcs Beli harus berupa angka",
          "number.empty": "Pcs Beli tidak boleh kosong",
          "any.required": "Pcs Beli harus diisi",
        }),
        harga_jual: Joi.number().required().messages({
          "number.base": "Harga Jual harus berupa angka",
          "number.empty": "Harga Jual tidak boleh kosong",
          "any.required": "Harga Jual harus diisi",
        }),
        harga_grosir: Joi.number().required().messages({
          "number.base": "Harga Grosir harus berupa angka",
          "number.empty": "Harga Grosir tidak boleh kosong",
          "any.required": "Harga Grosir harus diisi",
        }),
        subtotal: Joi.number().required().messages({
          "number.base": "Subtotal harus berupa angka",
          "number.empty": "Subtotal tidak boleh kosong",
          "any.required": "Subtotal harus diisi",
        }),
        is_new: Joi.boolean().required().messages({
          "boolean.base": "Is New harus berupa boolean",
          "any.required": "Is New harus diisi",
        }),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.base": "Barang harus berupa array",
      "array.empty": "Barang tidak boleh kosong",
      "any.required": "Barang harus diisi",
      "array.min": "Minimal data barang 1",
    }),
});

module.exports = pembelianSchema;
