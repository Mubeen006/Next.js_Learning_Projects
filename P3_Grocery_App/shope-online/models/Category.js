import mongoose from 'mongoose';

// Check if mongoose is being used on the client-side
const isClient = typeof window !== 'undefined';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

let Category;

// Only create the model on the server side
if (!isClient) {
  Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
}

export default Category; 