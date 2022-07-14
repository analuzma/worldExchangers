const router = require("express").Router();
//Models
const Country = require("../models/Country.model");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
//Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const hasDoneStep2 = require("../middleware/hasDoneStep2");
const {checkRole} =require("../middleware/checkRole")

//COUNTRIES LIST
router.get("/list", isLoggedIn, hasDoneStep2, (req, res, next) => {
  const {user} = req.session
  Country.find()
  .sort({ name: 1 })
  .then((countries)=>{
    res.render("country/list-country", {countries, user})
  })
  .catch((error)=>{
    console.log("error", error)
    next()
  })
});

//COUNTRY PROFILE by id
// router.get("/:id",isLoggedIn, hasDoneStep2, (req, res, next) => {
//   const {id} = req.params;
//   Country.findById(id)
//   .then((country)=>{
//     console.log(country)
//     res.render("country/profile",  country)
//   })
//   .catch((error)=>{
//     console.log("error", error)
//     next()
//   })
// });
// router.get("/:id", isLoggedIn, hasDoneStep2, async(req, res, next) => {
//   try{
//   const {id} =req.params
//     const {user} = req.session

//   const country = await Country.findById( id )
//   const users = await User.find({'_home_country': `${id}`}).populate("username profile_pic")
//   res.render("country/list-country", {country, users})
//   }
//   catch(error){next(error)}
// });
router.get("/:id", isLoggedIn, hasDoneStep2, (req, res, next) => {
    const {id} =req.params
    const {user} = req.session

  Country.findById(id).populate('_students').then((data)=>{
res.render("country/profile", {user, data});
  })
})

module.exports = router;