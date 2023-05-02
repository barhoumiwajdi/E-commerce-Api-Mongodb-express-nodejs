const mongoose = require('mongoose');
const schema = mongoose.Schema;
const ProductSchema = new schema({
  Name: {
    type: String,
    required: true
  },
  Disponibility: {
    type: String,
    default: "In stock",
  },
  Reference: {
    type: String,
    required: true
  },
  Brand: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true
  },
  Image: {
    type: Buffer
  },
  ImageLink: String,
  Category: [{
    type: String,
    required: true
  }],
  Quantity: {
    type: Number,
    required: true
  },
  Color: [{
    type: String,
    required: true
  }],
  Price: {
    type: Number,
    required: true
  }
}
  , {
    timestamps: true,
    versionKey: false
  })
module.exports = mongoose.model('Product', ProductSchema)