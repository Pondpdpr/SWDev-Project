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
  totalRoom: {
    type: Number,
    min: 0,
  },
  totalAvailableRoom: {
    type: Number,
    min: 0,
  },
  rooms: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Hotel", HotelSchema);
