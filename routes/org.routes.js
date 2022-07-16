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

    Organization.findById(id).populate('_students _org_owner _org_country')
    .then((data)=>{
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
/* Update ORGANIZATION post*/
router.post('/edit/:id', fileUploader.single("org_logo"), (req,res,next)=>{
      let org_logo;
    if (req.file) {
      org_logo = req.file.path;
    }
 const {id} =req.params
 const { org_name, ...restUser } = req.body;
 const { user } = req.session;

    Organization.findByIdAndUpdate(id,{ ...restUser, org_name, org_logo },
      { new: true })
    .then((data)=>{
         req.session.user = user;
         res.redirect(`/org/${id}`)
    })
      .catch((error) => {
        next(error);
      });
});

/* Delete ORGANIZATION get*/
router.get('/delete/:_id', (req,res,next)=>{
    const {_id} = req.params;
   const { user } = req.session;
    User.findOneAndDelete(user, {_organization, org_owner})

    Organization.findByIdAndDelete(_id)
            .then((deleted)=>{
              req.session.user = user;
            res.redirect(`/org/${_id}`);
            })
    .catch(error=>console.log('error',error))
})


// //EXPORTS
module.exports = router;