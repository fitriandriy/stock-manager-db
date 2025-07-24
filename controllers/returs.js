const { Returs } = require("../db/models");
const { Op, json } = require("sequelize");

module.exports = {
  updateRetur: async (req, res) => {
    try {
      const { date, data } = req.body;

      if (!date || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Mohon lengkapi isian data.' });
      }

      console.log(JSON.stringify(data))

      const results = [];

      for (const item of data) {
        const {
          product_id,
          stock,
          stock_description,
          items_out,
          items_out_description
        } = item;

        const existing = await Returs.findOne({
          where: { date, product_id }
        });

        if (existing) {
          await existing.update({
            stock,
            stock_description,
            items_out,
            items_out_description
          });
          results.push({ product_id, status: 'updated', data: existing });
        } else {
          const created = await Returs.create({
            date,
            product_id,
            stock,
            stock_description,
            items_out,
            items_out_description
          });
          results.push({ product_id, status: 'created', data: created });
        }
      }

      return res.status(200).json({
        message: 'Retur data processed successfully',
        data: results
      });

    } catch (error) {
      console.error('Error updating retur:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  query: async (req, res) => {
    try {
      const { date } = req.params;

      const retur = await Returs.findAll({
        where: {
          date: {
            [Op.eq]: date
          }
        }
      });

      res.status(200).json({
        status: true,
        message: 'success',
        data: retur
      });

    } catch (error) {
      console.error('Error updating retur:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

}