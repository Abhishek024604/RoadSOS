import mongoose from "mongoose";

const emergencyPlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number
  },
  phone: String,
  verified: { type: Boolean, default: false },
  address: String
}, { timestamps: true });

export const EmergencyPlace = mongoose.models.EmergencyPlace || mongoose.model("EmergencyPlace", emergencyPlaceSchema);
