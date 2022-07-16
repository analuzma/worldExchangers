const router = require("express").Router();
//Models
const Country = require("../models/Country.model");
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
//Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const {checkRole} =require("../middleware/checkRole")
const isLoggedOut = require("../middleware/isLoggedOut");
//Cloudinary file upload
const fileUploader = require("../config/cloudinary.config");
const res = require("express/lib/response");

//ROUTES GO HERE

/* Read ORGANIZATION get*/
router.get('/:id', isLoggedIn, (req,res,next)=>{
    const {id} =req.params
    const {user} = req.session

    Organization.findById(id).populate('_students _org_owner _org_country').then((data)=>{
    res.render("org/my-org", {user, data});
})
})
/* Update ORGANIZATION get*/
router.get('/edit/:id',(req,res,next)=>{
       const {id} =req.params
           const {user} = req.session
    if(!user){
        res.render('index')
        return;
    }

    Organization.findById(id)
    .then(org=>{
        //console.log('userFromDB',userFromDB)
         res.render('org/edit-org',{org , user})
         return;  
    })
    .catch(error=>console.log('Ha salido un error en GET edit user'))
});


// //EXPORTS
module.exports = router;