import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  title: {
    type: String,
    // required: true,
  },
  oldTitle: {
    type: String,
    // required: true,
  },
  image: { type: String },
  oldImage: { type: String },
  description: {
    type: String,
    // required: true,
  },
  oldDescription: {
    type: String,
    // required: true,
  },
  price: { type: Number },
  oldPrice: { type: Number },

  status: {
    type: String,
    enum: ['pending', 'rejected', 'approved'],
    default: 'pending',
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required:true,
    default:null
  },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
