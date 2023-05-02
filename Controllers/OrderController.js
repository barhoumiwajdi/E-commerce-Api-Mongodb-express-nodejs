const order = require('../Models/OrderModel')
const User = require('../Models/UserModel')
exports.addOrder = async (req, res) => {
  try {
    const neworder = await (await order.create(req.body)).populate('OrderItems', 'Products')
    res.status(200).send({ message: 'order added succefully', neworder })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.OrderList = async (req, res) => {
  try {
    const Orders = await order.find().populate('OrderItems', 'Products').populate('User', 'Name')
    res.status(200).send({ message: 'list of order', Orders })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.OrderById = async (req, res) => {
  try {
    const Order = await order.findById(req.params.id).populate('OrderItems', 'Products').populate('User', 'Name')
    res.status(200).send({
      message: 'your order wanted ', Order
    })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.updateOrder = async (req, res) => {
  try {
    await order.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send({ message: 'Order updated' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.deleteOrder = async (req, res) => {
  try {
    await order.findByIdAndDelete(req.params.id)
    res.status(200).send({ message: 'order deleted' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.getordersofuser = async (req, res) => {
  try {
    const userOrderList = await order.find({ User: req.params.userid }).populate('OrderItems', 'Products').sort({ 'dateOrdered': -1 });
    if (userOrderList) {
      res.status(200).send({ message: `list of orders of the user of the id  ${req.params.userid}`, userOrderList })
    }
    else {
      res.status(400).send({ message: "the user don't have any orer yet" })
    }
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}