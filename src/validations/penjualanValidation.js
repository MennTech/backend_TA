const Joi = require("joi");

const penjualanSchema = Joi.object({
  no_penjualan: Joi.string().required().messages({
    "string.empty": "No Penjualan tidak boleh kosong",
    "any.required": "No Penjualan harus diisi",
  }),
  tanggal: Joi.date().required().messages({
    "date.base": "Tanggal tidak valid",
    "any.required": "Tanggal harus diisi",
  }),
  total_harga: Joi.number().min(1).required().messages({
    "number.base": "Total Harga harus berupa angka",
    "number.min": "Total Harga tidak boleh 0 atau kurang",
    "any.required": "Total Harga harus diisi",
  }),
  metode_pembayaran: Joi.string()
    .valid("cash", "qris", "debit")
    .required()
    .messages({
      "string.base": "Metode Pembayaran harus berupa string",
      "string.empty": "Metode Pembayaran tidak boleh kosong",
      "any.required": "Metode Pembayaran harus diisi",
      "any.only": "Metode Pembayaran harus cash, qris, atau debit",
    }),
  jumlah_bayar: Joi.number().min(0).required().messages({
    "number.base": "Jumlah Bayar harus berupa angka",
    "number.min": "Jumlah Bayar tidak boleh kurang dari 0",
    "any.required": "Jumlah Bayar harus diisi",
  }),
  kembalian: Joi.number().min(0).required().messages({
    "number.base": "Kembalian harus berupa angka",
    "number.min": "Kembalian tidak boleh kurang dari 0",
    "any.required": "Kembalian harus diisi",
  }),
  barang: Joi.array()
    .items(
      Joi.object({
        kode_barang: Joi.number().required().messages({
          "number.base": "Kode Barang harus berupa angka",
          "number.empty": "Kode Barang tidak boleh kosong",
          "any.required": "Kode Barang harus diisi",
        }),
        jumlah_barang: Joi.number().integer().min(1).required().messages({
          "number.base": "Jumlah Barang harus berupa angka",
          "number.integer": "Jumlah Barang harus berupa angka bulat",
          "number.min": "Jumlah Barang minimal 1",
          "any.required": "Jumlah Barang harus diisi",
        }),
        harga_jual: Joi.number().min(1).required().messages({
          "number.base": "Harga Jual harus berupa angka",
          "number.min": "Harga Jual tidak boleh 0 atau kurang",
          "any.required": "Harga Jual harus diisi",
        }),
        potongan: Joi.number().min(0).required().messages({
          "number.base": "Potongan harus berupa angka",
          "number.min": "Potongan minimal 0",
          "any.required": "Potongan harus diisi",
        }),
        subtotal: Joi.number().min(1).required().messages({
          "number.base": "Subtotal harus berupa angka",
          "number.min": "Subtotal tidak boleh 0 atau kurang",
          "any.required": "Subtotal harus diisi",
        }),
      })
    )
    .required()
    .messages({
      "array.base": "Barang harus berupa array",
      "array.empty": "Barang tidak boleh kosong",
      "any.required": "Barang harus diisi",
    }),
});

module.exports = penjualanSchema;
