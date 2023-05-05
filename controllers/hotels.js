const Hotel = require("../models/Hotel");
const redis = require("../config/redis");
const config = require("../config/config");

//@desc Get all hotels
//@route GET /api/v1/hotels
//@access Public
exports.getHotels = async (req, res, next) => {
  let hotelRes;
  let query;
  let selectedFields;
  let sortByFields;
  let target;
  let size;
  let level;
  let ownership;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"];

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Hotel.find(JSON.parse(queryStr)).populate("bookings");

  // Select Fields
  if (req.query.select) {
    const splited = req.query.select.split(",");
    const fields = splited.join(" ");
    selectedFields = splited.join("-");
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const splited = req.query.sort.split(",");
    const sortBy = splited.join(" ");
    sortByFields = splited.join("-");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Target
  if (req.query.target) {
    target = req.query.target.split(",").join("-");
  }

  // Size
  if (req.query.size) {
    size = req.query.size.split(",").join("-");
  }

  // Level
  if (req.query.level) {
    level = req.query.level.split(",").join("-");
  }

  // Ownership
  if (req.query.ownership) {
    ownership = req.query.ownership.split(",").join("-");
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Hotel.countDocuments();

  query = query.skip(startIndex).limit(limit);

  try {
    // try to get cache
    hotelRes = await redis.cacheClient.get(
      getCacheKey({
        selectedFields,
        sortByFields,
        page,
        limit,
        target,
        size,
        level,
        ownership,
      })
    );

    if (hotelRes == null) {
      // Executing query
      const hotels = await query;

      // Pagination result
      const pagination = {};

      if (endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit,
        };
      }

      if (startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit,
        };
      }

      hotelRes = {
        success: true,
        count: hotels.length,
        pagination,
        data: hotels,
      };

      // save cache
      await redis.cacheClient.set(
        getCacheKey({
          selectedFields,
          sortByFields,
          page,
          limit,
          target,
          size,
          level,
          ownership,
        }),
        JSON.stringify(hotelRes),
        {
          EX: config.app.hotelCacheTTL,
        }
      );
    } else {
      hotelRes = JSON.parse(hotelRes);
    }

    res.status(200).json(hotelRes);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ success: false });
  }
};

//@desc Get single hotel
//@route GET /api/v1/hotels/:id
//@access Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch {
    res.status(400).json({ success: false });
  }
};

//@desc Create new hotel
//@route POST /api/v1/hotels
//@access Private
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc Update hotel
//@route PUT /api/v1/hotels/:id
//@access Private
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!hotel) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: hotel });
  } catch {
    res.status(400).json({ success: false });
  }
};

//@desc Delete hotel
//@route DELETE /api/v1/hotels/:id
//@access Private
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(400).json({
        success: false,
        message: `Bootcamp not found with id of ${req.params.id}`,
      });
    }

    hotel.remove();
    res.status(200).json({ success: true, data: {} });
  } catch {
    res.status(400).json({ success: false });
  }
};

const getCacheKey = (query) => {
  return `hotel-${query.select}-${query.sort}-${query.page}-${query.limit}-${query.target}-${query.size}-${query.level}-${query.ownership}`;
};
