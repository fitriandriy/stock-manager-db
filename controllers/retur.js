const { Retur } = require("../db/models");

module.exports = {
  updateRetur: async (req, res) => {
    try {
      const { date, data } = req.body;

      if (!date || !Array.isArray(data)) {
        return res.status(400).json({ message: 'Mohon lengkapi isian data.' });
      }

      const results = [];

      for (const item of data) {
        const {
          product_id,
          stock,
          stock_description,
          items_out,
          items_out_description
        } = item;

        const existing = await Retur.findOne({
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
          const created = await Retur.create({
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
        results
      });

    } catch (error) {
      console.error('Error updating retur:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  query: async (req, res) => {
    try {
      const { date } = req.query
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      const retur = await Retur.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        }
      })

      res.status(200).json({
        status: true,
        message: 'success',
        data: retur
      })
    } catch (error) {
      console.error('Error updating retur:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}