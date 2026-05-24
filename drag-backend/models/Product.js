import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountRate: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    colorCode: {
      type: String,
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
