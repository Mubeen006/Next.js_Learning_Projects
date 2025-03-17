import { Schema, model, models } from 'mongoose';

// Define the user schema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  gender: {
    type: String,
    enum: {
      values: ['Munda', 'Kudii'],
      message: '{VALUE} is not a valid gender option'
    },
    required: [true, 'Gender is required']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [1, 'Age must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Age must be a whole number'
    }
  },
  education: {
    type: String,
    trim: true
  },
  educationProgram: {
    type: String,
    trim: true
  },
  residence: {
    type: String,
    trim: true
  },
  passion: {
    type: String,
    trim: true
  },
  option: {
    type: String,
    enum: {
      values: ['friendship', 'relationship', 'suggestions', ''],
      message: '{VALUE} is not a valid option'
    },
    default: ''
  },
  reason: {
    type: String,
    trim: true
  },
  loveReason: {
    type: String,
    trim: true
  },
  advice: {
    type: String,
    trim: true
  },
  hobbies: {
    type: String,
    trim: true
  },
  number: {
    type: String,
    trim: true
  },
  image: {
    type: String, // Store Cloudinary URL instead of base64 data
    required: [true, 'Image is required']
  },
  imagePublicId: {
    type: String, // Store Cloudinary public ID for future reference
    trim: true
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

// Create and export the User model
// Use a try-catch to handle model compilation errors
let f3_User;
try {
  // Check if the model already exists to prevent overwriting during hot reloads
  f3_User = models.f3_User || model('f3_User', userSchema);
} catch (error) {
  f3_User = model('f3_User', userSchema);
}

export default f3_User; 