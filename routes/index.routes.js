const router = require("express").Router();
const Country = require("../models/Country.model");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
//Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const hasDoneStep2 = require("../middleware/hasDoneStep2");


//If you are not logged in as User or Organization, you go to Landing Page
router.get("/landing", (req, res, next) => {
  
  User.find().sort("createdAt: 1")
  .limit(8).populate("_host_country")
  .then((users)=>{
      res.render("landing", {users});
  })
});

/* lets you see homepage if you are logged in */
// router.get("/",isLoggedIn, hasDoneStep2, (req, res, next) => {
//   const {user} = req.session;
  
//   User.findById(user._id).populate('_host_country _organization').then((data)=>{
// res.render("index", {user, data});
//   })
// });

// HOME DASHBOARD
router.get("/", isLoggedIn, hasDoneStep2,
async (req, res, next) => {
  try {
    const {user} = req.session

    const userInfo = await User.findById(user._id).populate('_host_country _organization')
    const otherUsers = await User.find().sort("createdAt: 1")
  .limit(8).populate("_host_country")
    res.render("index", {userInfo, otherUsers, user})
  }
  catch(error){next(error)}
});




module.exports = router;