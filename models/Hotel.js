const mongoose = require("mongoose");
const { Schema } = mongoose;

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: true,
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
    unique: false,
  },
  tel: {
    type: String,
    required: [true, "Please add a telephone number"],
    unique: true,
  },
  size: {
    type: String,
    enum: ["small", "medium", "big"],
    required: [true, "Please add your hotel size"],
    default: "medium",
  },
  target: {
    type: String,
    enum: [
      "business",
      "airport",
      "suite",
      "extended stay",
      "serviced apartment",
      "resort",
      "bed and breakfast",
      "vacation rentals",
      "casino",
      "conference",
    ],
    required: [true, "please add the hotel target"],
    default: "suite",
  },
  level: {
    type: String,
    enum: ["world class", "mid-range", "budget"],
    required: [true, "Please add a level of service"],
    default: "mid-range",
  },
  ownership: {
    type: String,
    enum: ["independent", "single owner", "chain"],
  },
  bookings: {
    type: Schema.Types.ObjectId,
    ref: "bookings",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hotel", HotelSchema);
