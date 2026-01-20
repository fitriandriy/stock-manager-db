const { sequelize } = require("../external/postgres");
const { Fullskills } = require("../db/models");

module.exports = {
  add: async (req, res) => {
    try {
      const { warehouse_id, f1, f2, date, editor_id } = req.body;

      const existingData = await Fullskills.findOne({
        where: {
          warehouse_id,
          date
        }
      });

      let data;

      if (existingData) {
        await existingData.update({
          f1,
          f2,
          editor_id
        });

        data = existingData;
      } else {
        data = await Fullskills.create({
          warehouse_id,
          f1,
          f2,
          date,
          editor_id
        });
      }

      res.status(200).json({
        status: true,
        message: "success",
        data: data
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: "Internal Server Error"
      });
    }
  },

  getFullskillByMonth: async (req, res) => {
    try {
      const { month, warehouse_id } = req.query;

      if (!month || !warehouse_id) {
        return res.status(400).json({
          message: "Parameter 'month' dan 'warehouse_id' diperlukan (format: YYYY-MM & number)",
        });
      }

      const [year, monthNum] = month.split("-");
      const lastDay = new Date(year, monthNum, 0).getDate();
      const startDate = `${month}-01`;
      const endDate = `${month}-${lastDay.toString().padStart(2, "0")}`;

      const query = `
        WITH bahan_giling AS (
          SELECT DATE("createdAt") AS tanggal, SUM(amount) AS total_bahan_giling
          FROM "Stocks"
          WHERE transaction_type_id = 2
            AND warehouse_id = :warehouse_id
            AND "createdAt" BETWEEN :startDate AND :endDate
          GROUP BY DATE("createdAt")
        ),
        hasil_giling AS (
          SELECT DATE(sp."createdAt") AS tanggal, 
                SUM(sp.total * p.weight) AS total_hasil_giling
          FROM "StockProducts" sp
          JOIN "Products" p ON sp.product_id = p.id
          WHERE sp.product_transaction_id = 1
            AND sp.warehouse_id = :warehouse_id
            AND sp."createdAt" BETWEEN :startDate AND :endDate
          GROUP BY DATE(sp."createdAt")
        ),
        fullskills_data AS (
          SELECT TO_DATE(date, 'YYYY-MM-DD') AS tanggal, f1, f2
          FROM "Fullskills"
          WHERE warehouse_id = :warehouse_id
            AND date BETWEEN :startDate AND :endDate
        ),
        semua_tanggal AS (
          SELECT tanggal FROM bahan_giling
          UNION
          SELECT tanggal FROM hasil_giling
          UNION
          SELECT tanggal FROM fullskills_data
        )

        SELECT
          TO_CHAR(t.tanggal, 'YYYY-MM-DD') AS tanggal,
          :warehouse_id AS warehouse,
          COALESCE(bg.total_bahan_giling, 0) AS bahan_giling,
          COALESCE(fs.f1, 0) AS f1,
          COALESCE(hg.total_hasil_giling, 0) AS hasil_giling,
          COALESCE(fs.f2, 0) AS f2
        FROM semua_tanggal t
        LEFT JOIN bahan_giling bg ON t.tanggal = bg.tanggal
        LEFT JOIN hasil_giling hg ON t.tanggal = hg.tanggal
        LEFT JOIN fullskills_data fs ON t.tanggal = fs.tanggal
        ORDER BY t.tanggal ASC;
      `;

      const result = await sequelize.query(query, {
        replacements: {
          startDate,
          endDate,
          warehouse_id
        },
        type: sequelize.QueryTypes.SELECT
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error getFullskillByMonth:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}