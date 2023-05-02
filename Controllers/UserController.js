const user = require('../Models/UserModel');

exports.getuser = async (req, res) => {
  try {
    const users = await user.find()
    res.status(200).send({ message: 'list of users', users })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.updateuser = async (req, res) => {
  try {
    await user.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).send({ message: 'user updated' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}
exports.deleteuser = async (req, res) => {
  try {
    await user.findByIdAndDelete(req.params.id)
    res.status(200).send({ message: 'user deleted succefully' })
  } catch (error) {
    res.status(500).send({ message: 'error server' })
  }
}