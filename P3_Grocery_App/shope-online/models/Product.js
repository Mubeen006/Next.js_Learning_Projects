import mongoose from 'mongoose';

// Check if mongoose is being used on the client-side
const isClient = typeof window !== 'undefined';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    unit: {
      type: String,
      required: true,
      default: 'piece',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

let Product;

// Only create the model on the server side
if (!isClient) {
  Product = mongoose.models.Product || mongoose.model('Product', productSchema);
}

export default Product;