const fs = require('fs');
const csv = require('fast-csv');
const Product = require('../models/Product');

// @desc    Export products to CSV
// @route   GET /api/csv/export
// @access  Private/Admin
const exportProducts = async (req, res, next) => {
  try {
    const products = await Product.find({}).lean();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory.csv');

    const csvStream = csv.format({ headers: true });
    csvStream.pipe(res);

    products.forEach((product) => {
      csvStream.write({
        productName: product.productName,
        category: product.category,
        supplier: product.supplier,
        price: product.price,
        quantity: product.quantity,
        sku: product.sku,
        description: product.description,
        createdAt: product.createdAt
      });
    });

    csvStream.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Import products from CSV
// @route   POST /api/csv/import
// @access  Private/Admin
const importProducts = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a CSV file');
    }

    const products = [];
    fs.createReadStream(req.file.path)
      .pipe(csv.parse({ headers: true }))
      .on('error', (error) => {
        throw new Error(error.message);
      })
      .on('data', (row) => {
        // Validate required fields mapping if needed
        products.push({
          productName: row.productName,
          category: row.category,
          supplier: row.supplier,
          price: Number(row.price),
          quantity: Number(row.quantity),
          sku: row.sku,
          description: row.description || '',
          imageUrl: row.imageUrl || ''
        });
      })
      .on('end', async () => {
        // Remove uploaded file
        fs.unlinkSync(req.file.path);
        
        try {
          // Insert multiple products, ignore duplicates (optional based on logic)
          await Product.insertMany(products, { ordered: false });
          res.json({ message: `${products.length} products imported successfully` });
        } catch (dbError) {
          if(dbError.code === 11000) {
              res.status(400).json({ message: 'Some products could not be imported due to duplicate SKU' });
          } else {
              res.status(500).json({ message: 'Database error during import', error: dbError.message });
          }
        }
      });
  } catch (error) {
    next(error);
  }
};

module.exports = { exportProducts, importProducts };
