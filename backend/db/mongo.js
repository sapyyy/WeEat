const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// connecting to the db
mongoose.connect(process.env.URI);

// defining schema for food
const foodSchema = new Schema({
  name: {
    type: String,
  },
  type: {
    type: String,
    enum: [
      "Rice",
      "Pulao/Biriyani",
      "Chapati/Roti",
      "Daal/Paneer",
      "Mixed Veg Dal",
      "Sweets",
    ],
    required: true,
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
    type: String,
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
  password: {
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
  delivery: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonorDelivery",
    },
  ],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalMeals: {
    type: Number,
    default: 0,
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
      ref: "ReceiverDelivery",
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
});

// defining schema for the delivery
const receiverDeliverySchema = new Schema({
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
    required: true,
  },
});

// defining schemas for the admin delivery
const donorDeliverySchema = new Schema({
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
    required: true,
  },
});

// creating models for every schema
const Food = model("Food", foodSchema);
const List = model("List", listingSchema);
const ReceiverDelivery = model("ReceiverDelivery", receiverDeliverySchema);
const DonorDelivery = model("DonorDelivery", donorDeliverySchema);
const Donor = model("Donor", donorSchema);
const Receiver = model("Receiver", receiverSchema);

module.exports = {
  Food,
  List,
  ReceiverDelivery,
  DonorDelivery,
  Donor,
  Receiver,
};
