const router = require("express").Router();
//Models
const Country = require("../models/Country.model");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
//Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const {checkRole} =require("../middleware/checkRole")
//Cloudinary file upload
const fileUploader = require("../config/cloudinary.config");
const res = require("express/lib/response");
const { find } = require("../models/Country.model");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const req = require("express/lib/request");
const { redirect } = require("express/lib/response");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

//ROUTES GO HERE
/* Look at current USER profile*/
// router.get("/my-profile", isLoggedIn, hasDoneStep2, (req, res, next) => {
//   const {user} =req.session
//   User.findById(user._id)
//   .populate("_organization")
//   res.render("user/profile", user);
// });

/*  Read USER get*/
router.get("/:id", isLoggedIn, (req, res, next) => {
    const {id} =req.params
    const {user} =req.session
  User.findById(id).populate('_organization _host_country _home_country')
  .then((data)=>{res.render("user/profile", {user, data});})
  })

/* Update USER get*/
router.get('/edit/:id',(req,res,next)=>{
    const {user} = req.session
    if(!user){
        res.render('index')
        return;
    }
    User.findById(user._id)
    .then(userFromDB=>{
        //console.log('userFromDB',userFromDB)
         res.render('user/edit-user',{userFromDB , user})
         return;  
    })
    .catch(error=>console.log('Ha salido un error en GET edit user'))
});

/* Update USER post*/
router.post( "/edit/:id", fileUploader.single("profile_pic"),  (req, res, next) => {
    let profile_pic;
    if (req.file) {
      profile_pic = req.file.path;
    }

    const { role, ...restUser } = req.body;
    console.log("req.file", req.file);
    const { user } = req.session;
    console.log(profile_pic)
    User.findByIdAndUpdate(
      user._id,
      { ...restUser, profile_pic },
      { new: true }
    ).then((updatedUser) => {
        //sobrescribir el user current req.session
        req.session.user = updatedUser;
        res.redirect(`/user/${user._id}`);
      })
      .catch((error) => {
        next(error);
      });
  }
);
/* Delete USER get*/
router.get('/delete/:_id', (req,res,next)=>{
    const {_id} = req.params;

    User.findById(_id)
    .then(user=>{
        User.findByIdAndDelete(user._id)
            .then((deleted)=>{
                      req.session.user = deleted;
    req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
        res.redirect("/");
            })
    })
    .catch(error=>console.log('error',error))
})
})
//   try {
// router.get("/all", checkRole["ADMIN"], async (res,req,next)=>{
//   try {
//     const allUsers= await User.find().sort({username: 1})
//      const {user} = req.session
//     res.render("user/list-user", {allUsers, user})
//   }
//   catch(error){next(error)}
// });


//EXPORTS
module.exports = router;
