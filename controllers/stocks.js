const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { sequelize, queryTypes } = require("../external/postgres");
const jwt = require("jsonwebtoken")
const { Stocks, Users, Warehouses, Suppliers, Customers, MaterialTypes, TransactionTypes } = require("../db/models");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  // filter by warehouse and date
  // query_data: async (req, res) => {
  //   try {
  //     const { warehouse, date } = req.params;
  //     const startDate = new Date(`${date}T00:00:00Z`);
  //     const endDate = new Date(`${date}T23:59:59.999Z`);
  
  //     const data = await Stocks.findAll({
  //       where: {
  //         warehouse_id: warehouse,
  //         createdAt: {
  //           [Op.between]: [startDate, endDate]
  //         }
  //       },
  //       include: [
  //         {
  //           model: Warehouses,
  //           as: 'warehouse',
  //           attributes: ['name']
  //         },
  //         {
  //           model: Suppliers,
  //           as: 'supplier',
  //           attributes: ['name']
  //         },
  //         {
  //           model: MaterialTypes,
  //           as: 'material',
  //           attributes: ['name']
  //         },
  //         {
  //           model: TransactionTypes,
  //           as: 'transaction_type',
  //           attributes: ['name']
  //         },
  //         {
  //           model: Users,
  //           as: 'user',
  //           attributes: ['username']
  //         }
  //       ],
  //       attributes: ['id', 'amount', 'description'],
  //       order: [['id', 'ASC']]
  //     });
  
  //     const formattedData = await Promise.all(
  //       data.map(async (stock) => {
  //         const [totalAResult] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_A
  //           FROM "Stocks"
  //           WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'A')
  //             AND warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalA = parseInt(totalAResult[0]?.total_material_a || 0, 10);
      
  //         const [totalBResult] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_B
  //           FROM "Stocks"
  //           WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'B')
  //             AND warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalB = parseInt(totalBResult[0]?.total_material_b || 0, 10);
      
  //         const [totalCResult] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_C
  //           FROM "Stocks"
  //           WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'C')
  //             AND warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalC = parseInt(totalCResult[0]?.total_material_c || 0, 10);
      
  //         const [totalBrResult] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_Br
  //           FROM "Stocks"
  //           WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'Bramo')
  //             AND warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalBr = parseInt(totalBrResult[0]?.total_material_br || 0, 10);

  //         const [totalIR64Result] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 AND material_type_id IN 
  //               (SELECT id FROM "MaterialTypes" WHERE name IN ('A', 'B', 'C')) THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) AND material_type_id IN 
  //               (SELECT id FROM "MaterialTypes" WHERE name IN ('A', 'B', 'C')) THEN amount END), 0) AS total_IR64
  //           FROM "Stocks"
  //           WHERE warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalIR64 = parseInt(totalIR64Result[0]?.total_ir64 || 0, 10);
      
  //         const [totalGlobalBrResult] = await sequelize.query(`
  //           SELECT 
  //             COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //             COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_global_Br
  //           FROM "Stocks"
  //           WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'Bramo')
  //             AND warehouse_id = ${warehouse}
  //             AND "id" <= ${stock.id};
  //         `);
      
  //         const totalGlobalBr = parseInt(totalGlobalBrResult[0]?.total_global_br || 0, 10);
      
  //         return {
  //           id: stock.id,
  //           amount: stock.amount,
  //           warehouse: stock.warehouse.name,
  //           supplier: stock.supplier.name,
  //           material: stock.material.name,
  //           transaction_type: stock.transaction_type.name,
  //           user: stock.user.username,
  //           description: stock.description,
  //           totalA,
  //           totalB,
  //           totalC,
  //           totalBr,
  //           totalIR64,
  //           totalGlobalBr
  //         };
  //       })
  //     );
  
  //     console.log(`DATAA: ${JSON.stringify(formattedData, null, 2)}`);
  
  //     res.status(200).json({
  //       status: true,
  //       message: 'success',
  //       data: formattedData
  //     });
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({
  //       status: false,
  //       message: 'An error occurred while querying data',
  //       data: null
  //     });
  //   }
  // }, 

  // query_data: async (req, res) => {
  //   try {
  //     const { warehouse, date } = req.params;
  //     const startDate = new Date(`${date}T00:00:00Z`);
  //     const endDate = new Date(`${date}T23:59:59.999Z`);
  
  //     const data = await Stocks.findAll({
  //       where: {
  //         warehouse_id: warehouse,
  //         createdAt: {
  //           [Op.between]: [startDate, endDate]
  //         }
  //       },
  //       include: [
  //         {
  //           model: Warehouses,
  //           as: 'warehouse',
  //           attributes: ['name']
  //         },
  //         {
  //           model: Suppliers,
  //           as: 'supplier',
  //           attributes: ['name']
  //         },
  //         {
  //           model: MaterialTypes,
  //           as: 'material',
  //           attributes: ['name']
  //         },
  //         {
  //           model: TransactionTypes,
  //           as: 'transaction_type',
  //           attributes: ['name']
  //         },
  //         {
  //           model: Users,
  //           as: 'user',
  //           attributes: ['username']
  //         }
  //       ],
  //       attributes: ['id', 'amount', 'description', 'createdAt'],
  //       order: [['createdAt', 'ASC']]
  //     });
      
  //     const formattedData = await Promise.all(
  //       data.map(async (stock) => {        
  //           let lastTotalA = 0;
  //           let lastTotalB = 0;
  //           let lastTotalC = 0;
  //           let lastTotalBr = 0;
  //           let lastProcessedDate = null;
  //           const createdAtFormatted = stock.createdAt.toISOString();
  //           const currentDate = stock.createdAt.toISOString().split('T')[0];
      
  //           // Jika masuk ke tanggal baru, reset total ke nilai hari sebelumnya
  //           if (currentDate !== lastProcessedDate) {
  //             lastProcessedDate = currentDate;
  //           }
      
  //           // Query untuk mendapatkan total stok sebelum transaksi ini
  //           const [totalAResult] = await sequelize.query(`
  //             SELECT 
  //               COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //               COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_A
  //             FROM "Stocks"
  //             WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'A')
  //               AND warehouse_id = ${warehouse}
  //               AND "createdAt" <= '${createdAtFormatted}';
  //           `);
  //           let totalA = parseInt(totalAResult[0]?.total_material_a || 0, 10);
  //           if (currentDate === lastProcessedDate) {
  //             totalA = lastTotalA + stock.amount;
  //           }
  //           lastTotalA = totalA;
      
  //           // Query untuk total stok material B
  //           const [totalBResult] = await sequelize.query(`
  //             SELECT 
  //               COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //               COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_B
  //             FROM "Stocks"
  //             WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'B')
  //               AND warehouse_id = ${warehouse}
  //               AND "createdAt" <= '${createdAtFormatted}';
  //           `);
  //           let totalB = parseInt(totalBResult[0]?.total_material_b || 0, 10);
  //           if (currentDate === lastProcessedDate) {
  //             totalB = lastTotalB + stock.amount;
  //           }
  //           lastTotalB = totalB;
      
  //           // Query untuk total stok material C
  //           const [totalCResult] = await sequelize.query(`
  //             SELECT 
  //               COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //               COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_C
  //             FROM "Stocks"
  //             WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'C')
  //               AND warehouse_id = ${warehouse}
  //               AND "createdAt" <= '${createdAtFormatted}';
  //           `);
  //           let totalC = parseInt(totalCResult[0]?.total_material_c || 0, 10);
  //           if (currentDate === lastProcessedDate) {
  //             totalC = lastTotalC + stock.amount;
  //           }
  //           lastTotalC = totalC;
      
  //           // Query untuk total stok material Br
  //           const [totalBrResult] = await sequelize.query(`
  //             SELECT 
  //               COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
  //               COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) THEN amount END), 0) AS total_material_Br
  //             FROM "Stocks"
  //             WHERE material_type_id = (SELECT id FROM "MaterialTypes" WHERE name = 'Bramo')
  //               AND warehouse_id = ${warehouse}
  //               AND "createdAt" <= '${createdAtFormatted}';
  //           `);
  //           let totalBr = parseInt(totalBrResult[0]?.total_material_br || 0, 10);
  //           if (currentDate === lastProcessedDate) {
  //             totalBr = lastTotalBr + stock.amount;
  //           }
  //           lastTotalBr = totalBr;
      
  //           return {
  //             id: stock.id,
  //             amount: stock.amount,
  //             warehouse: stock.warehouse.name,
  //             supplier: stock.supplier.name,
  //             material: stock.material.name,
  //             transaction_type: stock.transaction_type.name,
  //             user: stock.user.username,
  //             description: stock.description,
  //             totalA,
  //             totalB,
  //             totalC,
  //             totalBr
  //           };
  //         })
  //       );
  
  //     console.log(`DATAA: ${JSON.stringify(formattedData, null, 2)}`);
  
  //     res.status(200).json({
  //       status: true,
  //       message: 'success',
  //       data: formattedData
  //     });
  //   } catch (error) {
  //     console.error('Error:', error);
  //     res.status(500).json({
  //       status: false,
  //       message: 'An error occurred while querying data',
  //       data: null
  //     });
  //   }
  // },
  
  query_data: async (req, res) => {
    try {
      const { warehouse, date } = req.params;
      const startDate = new Date(`${date}T00:00:00Z`);
      const endDate = new Date(`${date}T23:59:59.999Z`);
  
      // Ambil semua transaksi di rentang tanggal yang diminta
      const data = await Stocks.findAll({
        where: {
          warehouse_id: warehouse,
          createdAt: {
            [Op.between]: [startDate, endDate]
          }
        },
        include: [
          { model: Warehouses, as: 'warehouse', attributes: ['name'] },
          { model: Suppliers, as: 'supplier', attributes: ['name'] },
          { model: Customers, as: 'customer', attributes: ['name'] },
          { model: MaterialTypes, as: 'material', attributes: ['name'] },
          { model: TransactionTypes, as: 'transaction_type', attributes: ['name'] },
          { model: Users, as: 'user', attributes: ['username'] }
        ],
        attributes: ['id', 'amount', 'description', 'createdAt', 'transaction_type_id', 'material_type_id'],
        order: [['id']]
      });
  
      // Ambil total stok awal sebelum periode yang diminta
      const initialTotals = await sequelize.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN transaction_type_id = 1 THEN amount END), 0) -
          COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3, 4) THEN amount END), 0) AS total,
          material_type_id
        FROM "Stocks"
        WHERE warehouse_id = ${warehouse} AND "createdAt" < '${startDate.toISOString()}'
        GROUP BY material_type_id;
      `, { type: sequelize.QueryTypes.SELECT });
  
      // Mapping total stok awal berdasarkan material_type_id
      const totalStockCache = {
        A: initialTotals.find(row => row.material_type_id === 1)?.total || 0,
        B: initialTotals.find(row => row.material_type_id === 2)?.total || 0,
        C: initialTotals.find(row => row.material_type_id === 3)?.total || 0,
        BRAMO: initialTotals.find(row => row.material_type_id === 4)?.total || 0,
      };
  
      let lastProcessedDate = null;
  
      // Format ulang data dengan perhitungan total stok
      const formattedData = data.map(stock => {
        const currentDate = stock.createdAt.toISOString().split('T')[0];
  
        // Jika berganti hari, reset perhitungan total ke hari sebelumnya
        if (currentDate !== lastProcessedDate) {
          lastProcessedDate = currentDate;
        }
  
        // Update total stok sesuai dengan jenis transaksi
        const materialKey = stock.material.name.trim().toUpperCase();
        if (materialKey === "BRAMO") {
          totalStockCache["BR"] = totalStockCache["BR"] || 0;
        } else {
          totalStockCache[materialKey] = totalStockCache[materialKey] || 0;
        }

        const stockAmount = Number(stock.amount);

        if (!totalStockCache[materialKey]) {
          totalStockCache[materialKey] = 0;
        } else {
          totalStockCache[materialKey] = Number(totalStockCache[materialKey]) || 0; // Konversi ke number
        }

        if (stock.transaction_type_id === 1) { // Transaksi masuk
          totalStockCache[materialKey] += stockAmount;
        } else if (stock.transaction_type_id === 2 || stock.transaction_type_id === 3 || stock.transaction_type_id === 4) { // Transaksi keluar
          totalStockCache[materialKey] -= stockAmount;
        }

        totalIR64 = Number(totalStockCache["A"]) + Number(totalStockCache["B"]) + Number(totalStockCache["C"]);
        totalGlobalBr = Number(totalStockCache["BRAMO"]) || 0;
        
        return {
          id: stock.id,
          amount: stock.amount,
          warehouse: stock.warehouse.name,
          supplier: stock.supplier?.name || "N/A",
          customer: stock.customer?.name || "N/A",
          material: stock.material.name,
          transaction_type: stock.transaction_type.name,
          user: stock.user.username,
          description: stock.description,
          totalA: totalStockCache.A,
          totalB: totalStockCache.B,
          totalC: totalStockCache.C,
          totalBr: totalStockCache.BRAMO || 0,
          totalIR64,
          totalGlobalBr
        }; 
      });
  
      res.status(200).json({
        status: true,
        message: 'success',
        data: formattedData
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({
        status: false,
        message: 'An error occurred while querying data',
        data: null
      });
    }
  },  

  create: async (req, res) => {
    try {
      const { warehouse_id, supplier_id, customer_id, material_type_id, amount, transaction_type_id, editor_id, createdAt } = req.body;

      const user = await Users.findOne({where: {id: editor_id}})

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${editor_id} is not found.`,
          data: null
        })
      }

      const stocks = await Stocks.create({
        warehouse_id,
        supplier_id,
        customer_id,
        material_type_id,
        amount,
        transaction_type_id,
        editor_id,
        createdAt,
        updatedAt: new Date()
      })

      console.log(stocks.toJSON())
      if ( stocks ) {
        res.status(200).json({
          status: true,
          message: "success",
          data: stocks
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  move: async (req, res) => {
    try {
      const { warehouse_id, destination, material_type_id, amount, editor_id, createdAt } = req.body;

      const user = await Users.findOne({where: {id: editor_id}})
      const transferId = uuidv4();

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${editor_id} is not found.`,
          data: null
        })
      }

      // CREATE STOK PINDAH
      const stocks = await Stocks.create({
        warehouse_id,
        supplier_id: 0,
        material_type_id,
        amount,
        transaction_type_id: 3,
        editor_id,
        description: `Pindah GD${destination}`,
        transfer_id: transferId,
        createdAt,
        updatedAt: new Date()
      })

      // CREATE STOK TAMBAH
      const moved = await Stocks.create({
        warehouse_id: destination,
        supplier_id: 0,
        material_type_id,
        amount,
        transaction_type_id: 1,
        editor_id,
        description: `GD${warehouse_id}`,
        transfer_id: transferId,
        createdAt,
        updatedAt: new Date()
      })

      console.log(stocks.toJSON())
      if ( stocks ) {
        res.status(200).json({
          status: true,
          message: "success",
          data: stocks
        })
      }
    } catch (error) {
      console.log(error)
    }
  },

  update: async (req, res) => {
    try {
      const { id, warehouse_id, supplier_id, material_type_id, amount, transaction_type_id, editor_id } = req.body;
      const { authorization } = req.headers;

      const token = authorization.split(" ")[1];
      const data = jwt.verify(token, JWT_SECRET_KEY);
      
      if ( data.role !== "superadmin") {
        return res.status(403).json({
          status: false,
          message: "You don't have permission to access this resource",
          data: null
        })
      }

      const update = await Stocks.update({
        warehouse_id,
        supplier_id,
        material_type_id,
        amount,
        transaction_type_id,
        editor_id,
        updatedAt: new Date()
      }, {where: {id}})

      if (update) {
        return res.status(200).json({
          status: true,
          message: "success",
          data: await Stocks.findOne({where: {id}})
        })
      }
    } catch (error) {
      console.log(error)
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
  
      const findData = await Stocks.findOne({ where: {id} })

      if (!findData) {
        return res.status(404).json({
          status: false,
          message: `Stock with ID ${id} not found.`,
          data: null
        });
      }

      const deletedStock = await Stocks.destroy({
        where: { id }
      });

      if ( findData.transfer_id !== null ) {
        await Stocks.destroy({
          where: { transfer_id: findData.transfer_id }
        });
      }
      
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
  },

  reports: async (req, res) => {
    try {
      const {date} = req.params;

      const giling64 = await sequelize.query(`
        SELECT SUM(amount) AS total_amount
          FROM "Stocks"
          WHERE transaction_type_id = 2
            AND material_type_id IN (1, 2, 3)
            AND DATE("createdAt") = ${date};
        `)
      const gilingBr = await sequelize.query(`
        SELECT SUM(amount) AS total_amount
          FROM "Stocks"
          WHERE transaction_type_id = 2
            AND material_type_id IN (4)
            AND DATE("createdAt") = ${date};
        `)
      const totalA = await sequelize.query(`
        `)
      const [totalIR64Result] = await sequelize.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN transaction_type_id = 1 AND material_type_id IN 
            (SELECT id FROM "MaterialTypes" WHERE name IN ('A', 'B', 'C')) THEN amount END), 0) -
          COALESCE(SUM(CASE WHEN transaction_type_id IN (2, 3) AND material_type_id IN 
            (SELECT id FROM "MaterialTypes" WHERE name IN ('A', 'B', 'C')) THEN amount END), 0) AS total_IR64
        FROM "Stocks"
        WHERE "createdAt" <= '2025-01-24'
      `);
    } catch (error) {
      
    }
  }
}