import mongoose from 'mongoose';

const AdminEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  addedBy: {
    type: String, // Clerk userId of who added this email
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active'
  }
});

// Check if model already exists, if not create it
const AdminEmail = (mongoose.models && mongoose.models.AdminEmail) 
  ? mongoose.models.AdminEmail 
  : mongoose.model('AdminEmail', AdminEmailSchema);

export default AdminEmail;
