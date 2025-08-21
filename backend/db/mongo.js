const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { mongoURI } = process.env.MONGO_URI;

// connecting to the db
mongoose.connect(mongoURI);

// defining schema for food
const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Rice",
      "Roti/Chapati",
      "Pulao/Biriyani",
      "Idli/Dosa",
      "Paneer",
      "Mixed Veg Dal",
      "Sandwich",
      "Sweets",
      "Noodles",
    ],
    required: "true",
  },
  quantity: {
    type: Number,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  expiryTime: {
    type: Date,
  },
});

// defining schemas for donor
const donorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  organization: {
    type: String,
    enum: [
      "Canteen",
      "Hostel",
      "Event Organizer",
      "Catering",
      "Cafe/Restaurants",
    ],
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  totalQuantity: {
    type: Number,
  },
});

// defining schemas for the receiver
const receiverSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    required: true,
    minLength: 10,
    maxLength: 10,
  },
  receiverType: {
    type: String,
    enum: ["Student", "NGO"],
    required: true,
  },
  certificate: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
    },
  ],
});

// defining schemas for the listing
const listingSchema = new Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
  },
  foods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  preparedAt: {
    type: Date,
    required: true,
  },
});

// defining schema for the delivery
const deliverySchema = new Schema({
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receiver",
  },
  foods: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
    },
  ],
  delivered: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: Number,
    minLength: 10,
    maxLength: 10,
    unique: true,
  },
});

// creating models for every schema
const Food = model("Food", foodSchema);
const List = model("List", listingSchema);
const Delivery = model("Delivery", deliverySchema);
const Donor = model("Donor", donorSchema);
const Receiver = model("Receiver", receiverSchema);

module.exports = {
  Food,
  List,
  Delivery,
  Donor,
  Receiver,
};
