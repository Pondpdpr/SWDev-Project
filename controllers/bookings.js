const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only their own bookings
  if (req.user.role === "user") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name province tel",
    });
  } else {
    //Admins can see all bookings
    query = Booking.find().populate({
      path: "hotel",
      select: "name province tel",
    });
  }
  try {
    const bookings = await query;
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "hotel",
      select: "name description tel",
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Add booking
//@route POST /api/v1/bookings
//@access Private
exports.addBooking = async (req, res, next) => {
  try {
    //Add user and hotel to req.body
    req.body.user = req.user.id;
    req.body.hotel = req.params.hotelId;

    //Check for existed booking
    const existedBooking = await Booking.find({
      user: req.user.id,
      hotel: req.params.hotelId,
    });

    //If the user is not an admin, they can only create 3 bookings
    if (existedBooking.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }

    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`,
      });
    }

    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Cannot create Booking" });
  }
};

//@desc Update booking
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    booking = await Booking.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    // Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    await booking.remove();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Cannot delete Booking" });
  }
};
