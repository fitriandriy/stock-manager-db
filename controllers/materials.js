const { Op, fn, col, literal } = require("sequelize");
const { Stocks, Products, StockProducts, Purchases } = require("../db/models");
const { sequelize } = require("../external/postgres");

module.exports = {
  getRekapProduksi: async (req, res) => {
    try {
      const startDate = new Date('2025-12-31');

      // Total bahan giling hanya yang transaction_type_id: 2
      const totalBahan = await Stocks.sum('amount', {
        where: {
          transaction_type_id: 2,
          createdAt: { [Op.gte]: startDate }
        }
      });

      // Total hasil produksi hanya dari product_transaction_id: 1
      const totalProduksi = await StockProducts.sum('total', {
        where: {
          product_transaction_id: 1,
          transfer_id: null,
          createdAt: { [Op.gte]: startDate }
        }
      });

      // Total hasil produksi per produk
      const totalPerProduk = await StockProducts.findAll({
        where: {
          product_transaction_id: 1,
          transfer_id: null,
          createdAt: { [Op.gte]: startDate }
        },
        include: {
          model: Products,
          attributes: ['name', 'id'],
          as: "product"
        },
        attributes: [
          'product_id',
          [fn('SUM', col('total')), 'total']
        ],
        group: ['product_id', 'product.id'],
        raw: true
      });

      const hasilPerProduk = totalPerProduk.map(item => ({
        product_id: item['product.id'],
        nama: item['product.name'],
        total: parseInt(item.total)
      }));

      // Ambil semua tanggal dari Stocks
      const tanggalBahan = await Stocks.findAll({
        where: { createdAt: { [Op.gte]: startDate } },
        attributes: [[fn('DATE', col('createdAt')), 'tanggal']],
        group: [fn('DATE', col('createdAt'))],
        raw: true
      });

      // Ambil semua tanggal dari StockProducts
      const tanggalProduk = await StockProducts.findAll({
        where: {
          product_transaction_id: 1,
          createdAt: { [Op.gte]: startDate }
        },
        attributes: [[fn('DATE', col('createdAt')), 'tanggal']],
        group: [fn('DATE', col('createdAt'))],
        raw: true
      });

      // Gabungkan dan buat array tanggal unik yang urut
      const semuaTanggal = [
        ...new Set([...tanggalBahan, ...tanggalProduk].map(item => item.tanggal))
      ].sort();

      // Ambil total bahan giling per tanggal
      const bahanPerTanggal = await Stocks.findAll({
        where: { createdAt: { [Op.gte]: startDate } },
        attributes: [
          [fn('DATE', col('createdAt')), 'tanggal'],
          [fn('SUM', literal(`CASE WHEN transaction_type_id = 2 THEN amount ELSE 0 END`)), 'bahan_giling']
        ],
        group: [fn('DATE', col('createdAt'))],
        raw: true
      });

      const mapBahan = Object.fromEntries(
        bahanPerTanggal.map(row => [row.tanggal, parseInt(row.bahan_giling)])
      );

      // Ambil hasil produksi per produk per tanggal
      const produkPerTanggal = await StockProducts.findAll({
        where: {
          product_transaction_id: 1,
          transfer_id: null,
          createdAt: { [Op.gte]: startDate }
        },
        include: {
          model: Products,
          attributes: ['name', 'id'],
          as: "product"
        },
        attributes: [
          [fn('DATE', col('createdAt')), 'tanggal'],
          'product_id',
          [fn('SUM', col('total')), 'total']
        ],
        group: ['tanggal', 'product_id', 'product.id'],
        order: [[fn('DATE', col('createdAt')), 'ASC']],
        raw: true
      });

      const hasilMap = {};
      for (const row of produkPerTanggal) {
        const tgl = row.tanggal;
        if (!hasilMap[tgl]) hasilMap[tgl] = [];
        hasilMap[tgl].push({
          product_id: row['product.id'],
          nama: row['product.name'],
          total: parseInt(row.total)
        });
      }

      // 1. Ambil data plain dari table Purchases
      const purchases = await Purchases.findAll({ raw: true });

      // 2. Filter hanya product_id = 5 dan mapping nominal-nya ke per tanggal
      const pembelianProduk5 = purchases
        .filter(p => p.product_id === 5)
        .reduce((acc, curr) => {
          const tanggal = new Date(curr.date).toISOString().split('T')[0]; // kolom 'date'
          acc[tanggal] = (acc[tanggal] || 0) + Number(curr.nominal || 0);
          return acc;
        }, {});

      const hasilProduksi = semuaTanggal.map(tanggal => {
        const tanggalKey = new Date(tanggal).toISOString().split('T')[0]; // '2025-05-21'

        return {
          tanggal: new Date(tanggal).toLocaleDateString('id-ID'), // biar tampil enak dibaca
          bahan_giling: mapBahan[tanggal] || 0,
          hasil_produksi: hasilMap[tanggal] || [],
          pembelian: pembelianProduk5[tanggalKey] ?? null
        };
      });

      const total = await Purchases.findOne({
        attributes: [[fn('SUM', col('nominal')), 'totalSum']],
        where: {
          product_id: 5
        },
        raw: true,
      });

      // 11: bropre
      const totalPindahBahanBropre = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk Kuning',
          product_id: {
            [Op.in]: [11]
          }
        }
      });

      const bahanBpPs = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk PS',
          product_id: {
            [Op.in]: [11]
          }
        }
      });

      const bahanBpLebah = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk Lebah',
          product_id: {
            [Op.in]: [11]
          }
        }
      });

      // 14: eko
      const totalPindahBahanEko = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk Kuning',
          product_id: {
            [Op.in]: [14]
          }
        }
      });

      const bahanEkoPs = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk PS',
          product_id: {
            [Op.in]: [14]
          }
        }
      });

      const bahanEkoLebah = await StockProducts.sum('total', {
        where: {
          warehouse_id: 1,
          product_transaction_id: 3,
          description: 'Giling untuk Lebah',
          product_id: {
            [Op.in]: [14]
          }
        }
      });

      // kuning
      const bahanKuning25 = await StockProducts.sum('total', {
        where: {
          warehouse_id: 6,
          product_transaction_id: 3,
          description: 'Giling untuk Ekonomi',
          product_id: {
            [Op.in]: [26]
          }
        }
      })
      const bahanKuning10 = await StockProducts.sum('total', {
        where: {
          warehouse_id: 6,
          product_transaction_id: 3,
          description: 'Giling untuk Ekonomi',
          product_id: {
            [Op.in]: [27]
          }
        }
      })
      const bahanKuning5 = await StockProducts.sum('total', {
        where: {
          warehouse_id: 6,
          product_transaction_id: 3,
          description: 'Giling untuk Ekonomi',
          product_id: {
            [Op.in]: [28]
          }
        }
      })

      const totalPindahBahan = (totalPindahBahanBropre * 50) + (totalPindahBahanEko * 25)
      const bahanCampuranPS = (bahanBpPs * 50) + (bahanEkoPs * 25)
      const bahanCampuranLebah = (bahanBpLebah * 50) + (bahanEkoLebah * 25)
      const bahanCampuranEko = (bahanKuning25 * 25) + (bahanKuning10 * 10) + (bahanKuning5 * 5)

      // =====================
      // RETUR (TOTAL)
      // =====================
      const [totalRetur] = await sequelize.query(
        `
        SELECT
          COALESCE(SUM(ri.amount * p.weight), 0) AS total_weight
        FROM "SalesReturns" sr
        JOIN "ReturItems" ri ON ri.sales_return_id = sr.id
        JOIN "Products" p ON p.id = ri.product_id
        WHERE sr.date >= :startDate
        AND ri.product_id NOT IN (20, 32)
        `,
        {
          replacements: { startDate },
          type: sequelize.QueryTypes.SELECT
        }
      );

      // =====================
      // RETUR PER HARI
      // =====================
      const returPerHari = await sequelize.query(
        `
        SELECT
          sr.date,
          SUM(ri.amount * p.weight) AS total_weight
        FROM "SalesReturns" sr
        JOIN "ReturItems" ri ON ri.sales_return_id = sr.id
        JOIN "Products" p ON p.id = ri.product_id
        WHERE sr.date >= :startDate
        AND ri.product_id NOT IN (20, 32)
        GROUP BY sr.date
        ORDER BY sr.date
        `,
        {
          replacements: { startDate },
          type: sequelize.QueryTypes.SELECT
        }
      );

      res.status(200).json({
        total_retur: Number(totalRetur.total_weight),
        retur_per_hari: returPerHari,
        total_bahan_giling: totalBahan !== null ? parseInt(totalBahan) : null,
        total_pembelian: total.totalSum || 0,
        total_pindah_bahan: totalPindahBahan || 0,
        bahan_campuran_ps: bahanCampuranPS || 0,
        bahan_campuran_lebah: bahanCampuranLebah || 0,
        bahan_campuran_eko: bahanCampuranEko || 0,
        total_hasil_produksi: totalProduksi !== null ? parseInt(totalProduksi) : null,
        total_hasil_produksi_tiap_produk: hasilPerProduk,
        hasil_produksi: hasilProduksi
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Gagal mengambil data produksi' });
    }
  }
};
