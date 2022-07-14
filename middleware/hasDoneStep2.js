module.exports = (req, res, next) => {
    //obtain role from req.session.user

      const { step2, _id, role } = req.session.user
      if (!step2) {
        //if false redirect

        return res.redirect(`/auth/signup/${role}/${_id}`)
      } else {
      req.user = req.session.user;
      next();
      }
    }

    //       module.exports = (req, res, next) => {
    // //obtain role from req.session.user
    //   const { step2, _id, role } = req.session.user
    //   if (!step2 && (role === "USER")) {
    //     return res.redirect(`/auth/signup/student/${_id}`)
    //   } else {
    //      return res.redirect(`/auth/signup/org/${_id
    //     }`)}
    // }
