exports.checkRole = (arrayRoles) => {
  return (req, res, next) => {
  //obteain role from req.session.user
    const { role } = req.session.user;
    if (arrayRoles.includes(role)) {
      return next();
    } else {
      return res.status(403).send("Not allowed.");
    }
  };
};
