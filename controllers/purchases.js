const { Purchases, Customers, Products, StockProducts } = require("../db/models");
const { Op, fn, col } = require("sequelize");

module.exports = {
  create: async (req, res) => {
    try {
      const { date, supplier_id, product_id, nominal } = req.body;

      if (!date || !supplier_id || !product_id || !nominal) {
        return res.status(400).json({
          status: false,
          message: "Bad request.",
          data: null
        });
      }

      if ( product_id === 30 ) {
        await StockProducts.create({
          product_id: 30,
          warehouse_id: 5,
          product_transaction_id: 1,
          total: nominal/50,
          description: '',
          editor: 1
        })
      }

      const result = await Purchases.create({
        date,
        supplier_id,
        product_id,
        nominal
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: result
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || error,
        data: null
      });
    }
  },

  query: async (req, res) => {
    try {
      const { month, year } = req.query;

      if (!month || !year) {
        return res.status(400).json({
          status: false,
          message: "Month and year are required as query parameters.",
          data: null
        });
      }

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const purchases = await Purchases.findAll({
        where: {
          date: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          {
            model: Customers,
            as: "supplier",
            attributes: ["name"]
          },
          {
            model: Products,
            as: "product",
            attributes: ["name"]
          }
        ]
      });

      const totalPS5 = await Purchases.findOne({
        attributes: [[fn('SUM', col('nominal')), 'totalSum']],
        where: {
          product_id: 5
        },
        raw: true,
      });

      const totalKetan = await Purchases.findOne({
        attributes: [[fn('SUM', col('nominal')), 'totalSum']],
        where: {
          product_id: 30
        },
        raw: true,
      });

      const result = purchases.map(purchase => ({
        id: purchase.id,
        date: purchase.date,
        nominal: purchase.nominal,
        supplier: purchase.supplier?.name || null,
        product: purchase.product?.name || null
      }));

      return res.status(200).json({
        status: true,
        message: "Filtered purchases by month.",
        data: {
          totalPS5: totalPS5.totalSum,
          totalKetan: totalKetan.totalSum,
          data: result
        }
      });

    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error.message || error,
        data: null
      });
    }
  },

  deleteData: async (req, res) => {
    try {
      const { id } = req.params;

      if (id == null) {
        res.status(400).json({
          status: false,
          message: "bad request",
          data: null
        })
      }

      const data = await Purchases.findOne({ where: {id} })

      if (!data) {
        res.status(404).json({
          status: false,
          message: `data with id ${id} cannot be found.`,
          data: null
        })
      }

      const del = await Purchases.destroy({ where: {id} })

      res.status(200).json({
          status: true,
          message: "success",
          data: null
        })
      
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        status: false,
        message: error.message || error,
        data: null
      });
    }
  }
};
