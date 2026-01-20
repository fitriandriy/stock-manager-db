const { sequelize } = require("../external/postgres");
const { SalesReturns, ReturItems, Products } = require("../db/models");
const { Op } = require("sequelize");

module.exports = {
  add: async (req, res) => {
    const t = await sequelize.transaction();

    try {
      const { data } = req.body;

      const payload = data
      
      console.log(JSON.stringify(payload))

      if (!Array.isArray(payload) || payload.length === 0) {
        return res.status(400).json({
          status: false,
          message: "Payload tidak valid atau kosong",
        });
      }

      const createdReturns = [];

      for (const retur of payload) {
        const { date, toko, sopir_in, description, items } = retur;

        const createdRetur = await SalesReturns.create(
          {
            date,
            toko,
            sopir_in,
            description,
            status: false,
          },
          { transaction: t }
        );

        if (items && items.length > 0) {
          const returItemsData = items.map((item) => ({
            sales_return_id: createdRetur.id,
            product_id: item.product_id,
            amount: item.amount,
          }));

          await ReturItems.bulkCreate(returItemsData, { transaction: t });
        }

        createdReturns.push(createdRetur);
      }

      await t.commit();

      return res.status(200).json({
        status: true,
        message: "✅ Semua data retur berhasil disimpan",
        data: createdReturns,
      });
    } catch (error) {
      // Rollback kalau error
      await t.rollback();
      console.error("❌ Error add retur:", error);
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },

  queryData: async (req, res) => {
    try {
      const { startDate, endDate, status } = req.params;
      const whereClause = {};

      // 🗓️ Filter tanggal
      if (startDate && endDate) {
        // start & end date lengkap
        whereClause.date = { [Op.between]: [startDate, endDate] };
      } else if (startDate && !endDate) {
        // hanya startDate → sampai hari ini
        const now = new Date();
        whereClause.date = { [Op.between]: [startDate, now] };
      } else if (!startDate && !endDate && (status === undefined || status === null)) {
        // gak isi apa-apa → ambil 3 hari terakhir
        const now = new Date();
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);

        whereClause.date = { [Op.between]: [threeDaysAgo, now] };
      }

      if (status === 'true') {
        whereClause.status = true
      } else if (status === 'false') {
        whereClause.status = false
      }

      // 🚀 Query ke DB
      const data = await SalesReturns.findAll({
        attributes: [
          "id",
          "date",
          "toko",
          "sopir_in",
          "sopir_out",
          "return_date",
          "description",
          "status"
        ],
        where: whereClause,
        include: [
          {
            model: ReturItems,
            as: "returnitems",
            attributes: ["id", "product_id", "amount"],
          },
        ],
        order: [["date", "ASC"]],
      });

      const totalWeight = await sequelize.query(
        `
        SELECT
          SUM(ri.amount * p.weight) AS total_weight
        FROM "SalesReturns" sr
        JOIN "ReturItems" ri ON ri.sales_return_id = sr.id
        JOIN "Products" p ON p.id = ri.product_id
        WHERE sr.date BETWEEN '${startDate}' AND '${endDate}'
        `
      )

      res.status(200).json({
        status: true,
        message: "success",
        total_weight: totalWeight[0][0].total_weight || 0,
        data,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
      });
    }
  },

  edit: async (req, res) => {
    const { data } = req.body

    const t = await sequelize.transaction()

    try {
      for (const row of data) {
        const { id, ...header } = row
        const normalizeHeader = (header) => {
          const normalized = { ...header }
          if (normalized.return_date) {
            const [dd, mm, yyyy] = normalized.return_date.split("-")
            normalized.return_date = `${yyyy}-${mm}-${dd}`
          }
          return normalized
        }

        const safeHeader = normalizeHeader(header)

        await SalesReturns.update(
          {
            ...safeHeader,
            status: true
          },
          {
            where: { id },
            transaction: t
          }
        )
      }

      await t.commit()
      return res.json({ 
        status: true,
        message: "success" })
    } catch (err) {
      await t.rollback()
      console.error(err)
      return res.status(500).json({ message: "Update gagal" })
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const { authorization } = req.headers;
  
      if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({
          status: false,
          message: "Authorization token is missing or invalid.",
          data: null,
        });
      }
  
      const findData = await SalesReturns.findOne({ where: {id} })

      if (!findData) {
        return res.status(404).json({
          status: false,
          message: `Stock with ID ${id} not found.`,
          data: null
        });
      }

      const deletedStock = await SalesReturns.destroy({
        where: { id }
      });

      const deletedStockItems = await ReturItems.destroy({
        where: { sales_return_id : id }
      });
      
      if (deletedStock) {
        return res.status(200).json({
          status: true,
          message: 'success',
          data: null
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Internal server error.",
      });
    }
  }
}