import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tmdb_id: {
    type: Number,
    required: true,
    unique: true,
  },
  media_type: {
    type: String,
    enum: ['movie', 'tv'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Favourite', favouriteSchema);
