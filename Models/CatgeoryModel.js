const mongoose = require('mongoose');
const schema = mongoose.Schema;
const CategorySchema = new schema({
  Name: {
    type: String,
    required: true
  },
  Description: {
    type: String,
    required: true
  },
  Image: {
    type: String,
    required: true
  },
  Products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  ParentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}
  , {
    timestamps: true,
    versionKey: false
  })
module.exports = mongoose.model('Category', CategorySchema)