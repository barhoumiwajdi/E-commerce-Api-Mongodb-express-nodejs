function authRole(Role) {
  return (req, res, next) => {
    const user = req.user;
    if (user.role !== Role) {
      res.status(401).json("you don't have permission")
    }
    else {
      next()
    }
  }
}

module.exports = authRole