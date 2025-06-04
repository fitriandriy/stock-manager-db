const { Op, fn, col, literal } = require("sequelize");
const { Stocks, Products, StockProducts, Purchases } = require("../db/models");

module.exports = {
  getRekapProduksi: async (req, res) => {
    try {
      const startDate = new Date('2025-05-18');

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

      const hasilProduksi = semuaTanggal.map(tanggal => ({
        tanggal: new Date(tanggal).toLocaleDateString('id-ID'),
        bahan_giling: mapBahan[tanggal] || 0,
        hasil_produksi: hasilMap[tanggal] || []
      }));

      const total = await Purchases.findOne({
        attributes: [[fn('SUM', col('nominal')), 'totalSum']],
        raw: true,
      });

      res.json({
        total_bahan_giling: totalBahan !== null ? parseInt(totalBahan) : null,
        total_pembelian: total.totalSum || 0,
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
