const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Electronics', 'Grocery', 'Furniture', 'Clothing',
      'Stationery', 'Sports', 'Health', 'Home Appliances', 'Other'
    ]
  },
  supplier: {
    type: String,
    required: [true, 'Supplier is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than zero']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  imageUrl: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Virtual for inventory value
productSchema.virtual('inventoryValue').get(function() {
  return this.price * this.quantity;
});

// Ensure virtuals are included in JSON/Object
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
