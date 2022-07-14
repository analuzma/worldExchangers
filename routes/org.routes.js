const router = require("express").Router();
//Models
const Country = require("../models/Country.model");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
//Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const hasDoneStep2 = require("../middleware/hasDoneStep2");
const {checkRole} =require("../middleware/checkRole")
//Cloudinary file upload
const fileUploader = require("../config/cloudinary.config");
const isLoggedOut = require("../middleware/isLoggedOut");

//ROUTES GO HERE


router.get('/:id', isLoggedIn, hasDoneStep2, (req,res,next)=>{
    const {id} =req.params
    const {user} = req.session

    Organization.findById(id).populate('_students _org_owner _org_country').then((data)=>{
    res.render("org/my-org", {user, data});
})
})


// //EXPORTS
module.exports = router;