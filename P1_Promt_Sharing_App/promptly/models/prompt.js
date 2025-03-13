import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema({
  // this will create a referance with the User model in the database
  // it will give acual user id to creater field
  creator: { 
    type: Schema.Types.ObjectId,
    ref: 'User',// need to write exact name of particular model
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  }
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;