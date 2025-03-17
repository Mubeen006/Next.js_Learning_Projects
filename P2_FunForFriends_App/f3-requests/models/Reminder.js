import { Schema, model, models } from 'mongoose';

const ReminderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'f3_res_User',
    required: [true, 'Please provide a user ID'],
  },
  favoriteId: {
    type: Schema.Types.ObjectId,
    ref: 'Favorite',
    required: [true, 'Please provide a favorite ID'],
  },
  message: {
    type: String,
    required: [true, 'Please provide a reminder message'],
  },
  date: {
    type: Date,
    required: [true, 'Please provide a reminder date'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

let Reminder;
try {
  Reminder = models.Reminder || model('Reminder', ReminderSchema);
} catch (error) {
  Reminder = model('Reminder', ReminderSchema);
}

export default Reminder;