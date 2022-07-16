exports.checkRole = (arrayRoles) => {
  return (req, res, next) => {
  //obtain role from req.session.user
    const { role } = req.session.user;
    if (arrayRoles.includes(role)) {
      return next();
    } else {
      return res.redirect("/");
    }
  };
};
