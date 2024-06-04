
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now, required: false }
});

let ProductModel;

if (typeof window === 'undefined') {
  ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
}

export default ProductModel;