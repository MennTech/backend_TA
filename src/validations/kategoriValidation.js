const Joi = require("joi");

const kategoriSchema = Joi.object({
  nama: Joi.string().required().messages({
    "string.base": "Nama harus berupa string",
    "string.empty": "Nama tidak boleh kosong",
    "any.required": "Nama harus diisi",
  }),
  stok_minimal: Joi.number().integer().min(1).required().messages({
    "number.base": "Stok minimal harus berupa angka",
    "number.integer": "Stok minimal harus berupa bilangan bulat",
    "number.min": "Stok minimal tidak boleh kurang dari 0",
    "any.required": "Stok minimal harus diisi",
  }),
});

module.exports = kategoriSchema;
