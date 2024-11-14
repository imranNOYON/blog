import mongoose from "mongoose";

const EmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Export the model correctly
const EmailModel = mongoose.models.Email || mongoose.model('Email', EmailSchema);
export default EmailModel;
