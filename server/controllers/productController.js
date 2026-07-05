const Product = require('../models/Product');

// @desc    Get all products (with pagination, sort, filter)
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.pageSize) || 10;
    const page = Number(req.query.pageNumber) || 1;

    // Filtering
    const keyword = req.query.keyword
      ? {
          $or: [
            { productName: { $regex: req.query.keyword, $options: 'i' } },
            { category: { $regex: req.query.keyword, $options: 'i' } },
            { supplier: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const supplierFilter = req.query.supplier ? { supplier: req.query.supplier } : {};
    
    // Stock Status filter
    let stockFilter = {};
    if (req.query.stock) {
      if (req.query.stock === 'Out') stockFilter = { quantity: 0 };
      else if (req.query.stock === 'Low') stockFilter = { quantity: { $gt: 0, $lte: 10 } };
      else if (req.query.stock === 'In') stockFilter = { quantity: { $gt: 10 } };
    }

    const queryFilter = { ...keyword, ...categoryFilter, ...supplierFilter, ...stockFilter };

    // Sorting
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      if (req.query.sort === 'name_asc') sort = { productName: 1 };
      else if (req.query.sort === 'name_desc') sort = { productName: -1 };
      else if (req.query.sort === 'price_asc') sort = { price: 1 };
      else if (req.query.sort === 'price_desc') sort = { price: -1 };
      else if (req.query.sort === 'qty_asc') sort = { quantity: 1 };
      else if (req.query.sort === 'qty_desc') sort = { quantity: -1 };
      else if (req.query.sort === 'oldest') sort = { createdAt: 1 };
    }

    const count = await Product.countDocuments(queryFilter);
    const products = await Product.find(queryFilter)
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { productName, category, supplier, price, quantity, sku, description, imageUrl } = req.body;

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      res.status(400);
      throw new Error('Product with this SKU already exists');
    }

    const product = new Product({
      productName,
      category,
      supplier,
      price,
      quantity,
      sku,
      description,
      imageUrl
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { productName, category, supplier, price, quantity, description, imageUrl } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.productName = productName || product.productName;
      product.category = category || product.category;
      product.supplier = supplier || product.supplier;
      product.price = price !== undefined ? price : product.price;
      product.quantity = quantity !== undefined ? quantity : product.quantity;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard summary
// @route   GET /api/products/summary/dashboard
// @access  Private
const getDashboardSummary = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    
    const categories = await Product.distinct('category');
    const totalCategories = categories.length;

    const lowStockItems = await Product.countDocuments({ quantity: { $gt: 0, $lte: 10 } });
    const outOfStockItems = await Product.countDocuments({ quantity: 0 });

    const products = await Product.find({});
    const totalInventoryValue = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const recentProducts = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    const lowStockProductsList = await Product.find({ quantity: { $gt: 0, $lte: 10 } }).limit(5);

    res.json({
      totalProducts,
      totalCategories,
      lowStockItems,
      outOfStockItems,
      totalInventoryValue,
      recentProducts,
      lowStockProductsList
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDashboardSummary
};
