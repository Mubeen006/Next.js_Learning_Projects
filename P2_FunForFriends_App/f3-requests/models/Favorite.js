import { Schema, model, models } from 'mongoose';

const favoriteSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'f3_res_User',
    required: [true, 'User ID is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  // Add this to ensure virtuals are included when converting to JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create and export the Favorite model
let Favorite;
try {
  // Check if the model already exists to prevent overwriting during hot reloads
  Favorite = models.Favorite || model('Favorite', favoriteSchema);
} catch (error) {
  Favorite = model('Favorite', favoriteSchema);
}

export default Favorite; 