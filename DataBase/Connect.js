const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURL).then(() => { console.log('connected to db') })
  .catch((error) => {
    console.log(error)
  })