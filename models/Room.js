const RoomSchema = new mongoose.Schema({
  no: {
    type: String,
    required: [true, "Please add a room NO."],
    unique: true,
  },
  type: {
    type: String,
    enum: ["single", "double", "triple", "queen", "king"],
    default: "single",
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", RoomSchema);
