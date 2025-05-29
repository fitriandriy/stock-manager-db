const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");
const { sequelize } = require("../external/postgres");
const { Users, Warehouses, Products, Stocks, StockProducts, ProductTransactions } = require("../db/models");

module.exports = {
  query_data: async (req, res) => {
    try {
      const { warehouse, date } = req.params;

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const data = await StockProducts.findAll({
        where: {
          warehouse_id: warehouse,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay]
          }
        },
        include: [
          {
            model: Warehouses,
            as: 'warehouse',
            attributes: ['name']
          },
          {
            model: Users,
            as: 'user',
            attributes: ['username']
          },
          {
            model: Products,
            as: 'product',
            attributes: ['name']
          },
          {
            model: ProductTransactions,
            as: 'product_transaction',
            attributes: ['name']
          }
        ]
      });

      const result = data.map(item => ({
        id: item.id,
        produk: item.product.name,
        total: item.total,
        deskripsi: item.description,
        editor: item.user.username,
        gudang: item.warehouse.name,
        transfer_id: item.transfer_id,
        transaksi: item.product_transaction.name,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      res.status(200).json({
        status: true,
        message: 'success',
        data: result
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
  
  add_stock: async (req, res) => {
    try {
      const {
        warehouse_id,
        product_id,
        product_transaction_id,
        total: inputTotal,
        description,
        editor,
        createdAt
      } = req.body;

      const user = await Users.findOne({ where: { id: editor } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${editor} is not found.`,
          data: null
        });
      }

      let finalTotal = inputTotal;

      if (product_transaction_id === 1) {
        const tanggal = new Date(createdAt);

        // 1. Total keluar hari ini dari gudang yang sama
        const totalKeluarHariIni = await StockProducts.sum('total', {
          where: {
            warehouse_id, // hanya dari gudang yang sama
            product_id,
            product_transaction_id: { [Op.in]: [2, 3, 4] },
            createdAt: tanggal
          }
        });

        // 2a. Total masuk dari gudang ini hingga kemarin
        const totalMasukKemarin = await StockProducts.sum('total', {
          where: {
            warehouse_id,
            product_id,
            product_transaction_id: 1,
            createdAt: { [Op.lt]: tanggal }
          }
        });

        // 2b. Total keluar dari gudang ini hingga kemarin
        const totalKeluarKemarin = await StockProducts.sum('total', {
          where: {
            warehouse_id,
            product_id,
            product_transaction_id: { [Op.in]: [2, 3, 4] },
            createdAt: { [Op.lt]: tanggal }
          }
        });

        const masukKemarin = totalMasukKemarin || 0;
        const keluarKemarin = totalKeluarKemarin || 0;
        const keluarHariIni = totalKeluarHariIni || 0;

        const stokKemarin = masukKemarin - keluarKemarin;

        console.log(`STOK KEMARIN [GUDANG ${warehouse_id}]= ${stokKemarin}`);
        console.log(`KELUAR HARI INI [GUDANG ${warehouse_id}]= ${keluarHariIni}`);

        // Final formula: (input + keluarHariIni) - stokKemarin
        finalTotal = (parseInt(inputTotal) + keluarHariIni) - stokKemarin;
      }

      const stocks = await StockProducts.create({
        product_id,
        warehouse_id,
        product_transaction_id,
        total: finalTotal,
        description,
        transfer_id: null,
        editor,
        createdAt,
        updatedAt: new Date()
      });

      return res.status(200).json({
        status: true,
        message: "success",
        data: stocks
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan",
        error: error.message
      });
    }
  },

  create: async (req, res) => {
    try {
      const { warehouse_id, product_id, product_transaction_id, total, description, editor, createdAt } = req.body;

      const user = await Users.findOne({where: {id: editor}})

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${editor} is not found.`,
          data: null
        })
      }

      const stocks = await StockProducts.create({
        product_id,
        warehouse_id,
        product_transaction_id,
        total,
        description,
        transfer_id: null,
        editor,
        createdAt,
        updatedAt: new Date()
      })

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
      const { warehouse_id, destination, product_id, total, editor_id, createdAt } = req.body;
      console.log("BODY REQUEST:", req.body);
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
      const stocks = await StockProducts.create({
        warehouse_id,
        product_id,
        total,
        product_transaction_id: 4,
        editor: editor_id,
        description: `Pindah GD${destination}`,
        transfer_id: transferId,
        createdAt,
        updatedAt: new Date()
      })

      // CREATE STOK TAMBAH
      const moved = await StockProducts.create({
        warehouse_id: destination,
        product_id,
        total,
        product_transaction_id: 1,
        editor: editor_id,
        description: `GD${warehouse_id}`,
        transfer_id: transferId,
        createdAt,
        updatedAt: new Date()
      })

      if ( stocks ) {
        res.status(200).json({
          status: true,
          message: "success",
          data: stocks
        })
      }
    } catch (error) {
      console.error("ERROR IN MOVE CONTROLLER:", error);
      res.status(500).json({
        status: false,
        message: "Server error.",
        data: null
      })
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
  
      const findData = await StockProducts.findOne({ where: { id } });
  
      if (!findData) {
        return res.status(404).json({
          status: false,
          message: `StockProduct with ID ${id} not found.`,
          data: null
        });
      }
  
      const deletedStock = await StockProducts.destroy({
        where: { id }
      });
  
      if (findData.transfer_id !== null) {
        await StockProducts.destroy({
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
      const { date } = req.params;
  
      const giling64Result = await sequelize.query(
        `SELECT SUM(amount) AS total_amount
         FROM "Stocks"
         WHERE transaction_type_id = 2
         AND material_type_id IN (1, 2, 3)
         AND DATE("createdAt") = '${date}'`
      );
      
      const gilingBrResult = await sequelize.query(
        `SELECT SUM(amount) AS total_amount
         FROM "Stocks"
         WHERE transaction_type_id = 2
         AND material_type_id IN (4)
         AND DATE("createdAt") = '${date}'`
      );
      
      const totalAResult = await sequelize.query(
        `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 1 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 1 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_a"`
      );

      const totalBResult = await sequelize.query(
        `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 2 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 2 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_b"`
      );

      const totalCResult = await sequelize.query(
        `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 3 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 3 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_c"`
      );

      const totalBrResult = await sequelize.query(
        `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 4 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "material_type_id" = 4 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_br"`
      );

      const gilingBr = gilingBrResult[0][0].total_amount || 0;
      const giling64 = giling64Result[0][0].total_amount || 0;
      const totalA = totalAResult[0][0].total_stock_a || 0;
      const totalB = totalBResult[0][0].total_stock_b || 0;
      const totalC = totalCResult[0][0].total_stock_c || 0;
      const totalIR64 = parseInt(totalA) + parseInt(totalB) + parseInt(totalC)
      const totalBr = totalBrResult[0][0].total_stock_br || 0;

      const warehouses = await Warehouses.findAll()

      let data = [];

      for (const warehouse of warehouses) {
        const warehouseId = warehouse.id;
        const warehouseName = warehouse.name;

        const totalAResult = await sequelize.query(
          `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 1 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 1 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_a"`
        );

        const totalBResult = await sequelize.query(
          `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 2 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 2 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_b"`
        );

        const totalCResult = await sequelize.query(
          `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 3 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 3 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_c"`
        );

        const totalBrResult = await sequelize.query(
          `SELECT 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 4 
                     AND "transaction_type_id" = 1 
                     AND DATE("createdAt") <= '${date}'), 0) 
           - 
           COALESCE((SELECT SUM("amount") FROM "Stocks" 
                     WHERE "warehouse_id" = ${warehouseId}
                     AND "material_type_id" = 4 
                     AND "transaction_type_id" IN (2, 3, 4) 
                     AND DATE("createdAt") <= '${date}'), 0) 
           AS "total_stock_br"`
        );

        const totalA = totalAResult[0][0].total_stock_a || 0;
        const totalB = totalBResult[0][0].total_stock_b || 0;
        const totalC = totalCResult[0][0].total_stock_c || 0;
        const totalBr = totalBrResult[0][0].total_stock_br || 0;

        const totalIR64 = parseInt(totalA) + parseInt(totalB) + parseInt(totalC);

        data.push({
          id: warehouseId,
          warehouse: warehouseName,
          totalA,
          totalB,
          totalC,
          totalIR64,
          totalBr,
        });
      }
      
      return res.status(200).json({
        status: true,
        message: "success",
        data: {
          giling64,
          gilingBr,
          totalA,
          totalB,
          totalC,
          totalIR64,
          totalBr,
          stokGudang: data
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Internal server error.",
      });
    }
  },

  getProducts: async (req, res) => {
    try {
      const product = await Products.findAll()

      if (!product) {
        return res.status(404).json({
          status: false,
          message: "data not found.",
          data: null
        })
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: product
      })
      
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: error,
        data: null
      })
    }
  },

  getTotalStockPerWarehouse: async (req, res) => {
    try {
      const { warehouse, date } = req.params;
      const warehouse_id = parseInt(warehouse);
      const endOfDate = new Date(date);
      endOfDate.setHours(23, 59, 59, 999);
  
      // Tanggal awal hari (jam 00:00:00) dan akhir hari (23:59:59)
      const startOfDate = new Date(date);
      startOfDate.setHours(0, 0, 0, 0);
  
      const yesterday = new Date(endOfDate);
      yesterday.setDate(endOfDate.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
  
      const products = await Products.findAll();
  
      const result = [];
      const hasilGiling = [];
      const stokKeluar = [];
  
      for (const product of products) {
        // ======== STOK HARI INI ========
        const masukHariIni = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: 1,
            createdAt: {
              [Op.lte]: endOfDate
            },
          }
        });
  
        const keluarHariIni = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: {
              [Op.in]: [2, 3, 4]
            },
            createdAt: {
              [Op.lte]: endOfDate
            },
          }
        });
  
        const stokHariIni = (masukHariIni || 0) - (keluarHariIni || 0);
  
        // ======== STOK KEMARIN ========
        const masukKemarin = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: 1,
            createdAt: {
              [Op.lte]: yesterday
            },
          }
        });
  
        const keluarKemarin = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: {
              [Op.in]: [2, 3, 4]
            },
            createdAt: {
              [Op.lte]: yesterday
            },
          }
        });
  
        const stokKemarin = (masukKemarin || 0) - (keluarKemarin || 0);
        const hasilGilingHariIni = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: 1,
            createdAt: {
              [Op.between]: [startOfDate, endOfDate]
            }
          }
        });
  
        // ======== STOK KELUAR HARI INI ========
        const stokKeluarHariIni = await StockProducts.sum("total", {
          where: {
            warehouse_id,
            product_id: product.id,
            product_transaction_id: {
              [Op.in]: [2, 3, 4]
            },
            createdAt: {
              [Op.between]: [startOfDate, endOfDate]
            }
          }
        });
  
        // Push ke result
        result.push({
          product_name: product.name,
          total_stok: stokHariIni
        });
  
        hasilGiling.push({
          product_name: product.name,
          hasil_giling: hasilGilingHariIni || 0
        });
  
        stokKeluar.push({
          product_name: product.name,
          total_keluar: stokKeluarHariIni || 0
        });
      }
  
      res.status(200).json({
        status: true,
        message: "success",
        data: {
          stok: result,
          hasil_giling: hasilGiling,
          stok_keluar: stokKeluar
        }
      });
  
    } catch (error) {
      console.error("ERROR getTotalStockPerWarehouse:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
        data: null
      });
    }
  },

  getTotalStocks: async (req, res) => {
    try {
      const products = await Products.findAll();
      const warehouses = await Warehouses.findAll(); // misal ada 6 gudang (GD1 s/d GD6)

      const result = [];

      for (const product of products) {
        let totalMasuk = await StockProducts.sum("total", {
          where: {
            product_id: product.id,
            product_transaction_id: 1,
          },
        });

        let totalKeluar = await StockProducts.sum("total", {
          where: {
            product_id: product.id,
            product_transaction_id: {
              [Op.in]: [2, 3, 4],
            },
          },
        });

        const totalStok = (totalMasuk || 0) - (totalKeluar || 0);

        // Hitung stok per gudang
        const totalStokGudang = {};

        for (const warehouse of warehouses) {
          const masuk = await StockProducts.sum("total", {
            where: {
              warehouse_id: warehouse.id,
              product_id: product.id,
              product_transaction_id: 1,
            },
          });

          const keluar = await StockProducts.sum("total", {
            where: {
              warehouse_id: warehouse.id,
              product_id: product.id,
              product_transaction_id: {
                [Op.in]: [2, 3, 4],
              },
            },
          });

          totalStokGudang[`GD${warehouse.id}`] = (masuk || 0) - (keluar || 0);
        }

        result.push({
          product_id: product.id,
          nama_produk: product.name,
          total_stok: totalStok,
          total_stok_gudang: totalStokGudang,
        });
      }

      res.status(200).json({
        status: true,
        message: "Success",
        data: result,
      });
    } catch (error) {
      console.error("ERROR getTotalStocks:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
        data: null
      });
    }
  },

  getProductionProcessReport: async (req, res) => {
    try {
      const { date } = req.params;
      const parsedDate = new Date(date);
      const endOfDate = new Date(parsedDate.setHours(23, 59, 59, 999));

      const products = await Products.findAll();
      const result = [];

      for (const product of products) {
        let stock = 0;
        let hasil_giling = 0;
        let keluar_jual = 0;
        let keluar_giling = 0;

        if (product.id === 1 || product.id === 2) {
          const relevantMaterialIds = product.id === 1 ? [1, 2, 3] : [4];

          const masuk = await Stocks.sum("amount", {
            where: {
              material_type_id: { [Op.in]: relevantMaterialIds },
              transaction_type_id: 1,
              createdAt: { [Op.lte]: endOfDate },
              warehouse_id: { [Op.ne]: null }
            },
          });

          const keluar = await Stocks.sum("amount", {
            where: {
              material_type_id: { [Op.in]: relevantMaterialIds },
              transaction_type_id: { [Op.in]: [2, 3, 4] },
              createdAt: { [Op.lte]: endOfDate },
              warehouse_id: { [Op.ne]: null }
            },
          });

          keluar_jual = await Stocks.sum("amount", {
            where: {
              material_type_id: { [Op.in]: relevantMaterialIds },
              transaction_type_id: 4,
              createdAt: { [Op.between]: [new Date(date), endOfDate] },
              warehouse_id: { [Op.ne]: null }
            },
          }) || 0;

          keluar_giling = await Stocks.sum("amount", {
            where: {
              material_type_id: { [Op.in]: relevantMaterialIds },
              transaction_type_id: 2,
              createdAt: { [Op.between]: [new Date(date), endOfDate] },
              warehouse_id: { [Op.ne]: null }
            },
          }) || 0;

          stock = (masuk || 0) - (keluar || 0);
        } else {
          const masuk = await StockProducts.sum("total", {
            where: {
              product_id: product.id,
              product_transaction_id: 1,
              createdAt: { [Op.lte]: endOfDate },
              warehouse_id: { [Op.ne]: null }
            },
          });

          const keluar = await StockProducts.sum("total", {
            where: {
              product_id: product.id,
              product_transaction_id: { [Op.in]: [2, 3, 4] },
              createdAt: { [Op.lte]: endOfDate },
              warehouse_id: { [Op.ne]: null }
            },
          });

          hasil_giling = await StockProducts.sum("total", {
            where: {
              product_id: product.id,
              product_transaction_id: 1,
              createdAt: { [Op.between]: [new Date(date), endOfDate] },
              warehouse_id: { [Op.ne]: null }
            },
          }) || 0;

          keluar_jual = await StockProducts.sum("total", {
            where: {
              product_id: product.id,
              product_transaction_id: 2,
              createdAt: { [Op.between]: [new Date(date), endOfDate] },
              warehouse_id: { [Op.ne]: null }
            },
          }) || 0;

          keluar_giling = await StockProducts.sum("total", {
            where: {
              product_id: product.id,
              product_transaction_id: 3,
              createdAt: { [Op.between]: [new Date(date), endOfDate] },
              warehouse_id: { [Op.ne]: null }
            },
          }) || 0;

          stock = (masuk || 0) - (keluar || 0);
        }

        result.push({
          product_id: product.id,
          nama_product: product.name,
          stock,
          keluar: {
            jual: keluar_jual,
            giling: keluar_giling,
          },
          hasil_giling,
        });
      }

      res.status(200).json({
        status: true,
        message: "Laporan berhasil diambil",
        data: result,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        status: false,
        message: "Terjadi kesalahan pada server",
        error: err.message,
      });
    }
  }
}