import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'team_member'], required: true },
});

export default mongoose.models.User || mongoose.model('User', userSchema);
