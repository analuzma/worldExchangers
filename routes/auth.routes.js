const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const fileUploader = require("../config/cloudinary.config");
const req = require("express/lib/request");
// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Organization = require("../models/Organization.model");
const Country = require("../models/Country.model");

// Middlewares
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const hasDoneStep2 = require("../middleware/hasDoneStep2");
const {checkRole} =require("../middleware/checkRole")

/////////////////////////////////////**ROUTES**/

/////////SIGN UP GET
//get SIGN UP Step #1
router.get("/signup",  (req, res) => {
  res.render("auth/signup");
});
//get SIGN UP Step #2 (USER)
router.get("/signup/user/:id", checkRole(["USER","ADMIN"]),
async (req, res, next) => {
  try {
    const {id} =req.params
    const countries = await Country.find().sort({name:1 }  )
    const organizations = await Organization.find()
    const {user} = req.session
    
    res.render("auth/signup-student", {countries, organizations, user})
  }
  catch(error){next(error)}
});

//get SIGN UP Step #2 (ORGANIZATION)
router.get("/signup/org/:id", checkRole(["ORG","ADMIN"]),
async (req, res, next) => {
  try {
    const {id} =req.params
    const countries = await Country.find().sort({name:1 }  )
    const {user} = req.session
    res.render("auth/signup-org", {countries, user})
  }
  catch(error){next(error)}
});

/////////SIGN UP POST
//post SIGN UP Step #1
router.post("/signup", isLoggedOut, (req, res) => {
  const { username, password, first_name, email, role } = req.body;

  if (!username) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your username.",
    });
  }

  if (password.length < 5) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 5 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
  .then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "Username already taken." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          password: hashedPassword,
          first_name,
          email,
          role,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        if (user.role === "USER"){
          req.session.user= user;
          return   res.redirect(`/auth/signup/user/${user._id}`)
        };

        if (user.role === "ORG"){
          req.session.user= user;
           return res.redirect(`/auth/signup/org/${user._id}`)
          }
         

      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
                    console.log(error.code)
        // if (error.code === 11000) {
        //   return res.status(400).render("auth/signup", {
        //     errorMessage:
        //       "Username needs to be unique. The username you chose is already in use.",
        //   });
        // }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

//post SIGN UP Step #2 USER
router.post('/signup/user/:id', isLoggedIn, async (req,res,next)=>{
    
  const {id} = req.params
  const {_home_country, _host_country, _organization} = req.body;

  try{
    const user2 = await User.findByIdAndUpdate(id,{_home_country, _host_country, _organization, step2:true}, {new:true})
    
    const organization = await Organization.findByIdAndUpdate({_id: _organization}, {$push: {'_students': id}})

    const country = await Country.findByIdAndUpdate({_id: _host_country}, {$push: {'_students': id} })    
    
    res.redirect(`/user/${id}`)
  }catch(error){
    res.status(500).json({ error });
    console.log(error)}
});



//post SIGN UP Step #2 ORGANIZATION
// router.post('/signup/org/:id', isLoggedIn, async (req,res,next)=>{

//   const {id} = req.params;
//   const {_org_country, org_name, slogan, description, websiteURL} = req.body;
//   try{
//     const organization = await await Organization.create({_org_country, org_name, slogan, description, websiteURL, _org_owner:id}).populate("_org_country, org_name, slogan, description, websiteURL")

//     const user = await User.findByIdAndUpdate(id,{$push: {_}}, step2:true}, {new:true}).populate("_home_country _host_country _organization")
//     const user = await User.findByIdAndUpdate(id, { $set: { _organization: organization._id  }, step2: true }, {new:true})
//     .populate("_organization")
//     req.session.user=user
//     res.redirect("/")
//   }catch(error){res.status(500).json({ error });
//     console.log(error)}
// })

//////////LOG IN
//get LOG IN
router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login");
});

//post LOG IN
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(400).render("auth/login", {
      errorMessage: "Please provide your username.",
    });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 5) {
    return res.status(400).render("auth/login", {
      errorMessage: "Your password needs to be at least 5 characters long.",
    });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res.status(400).render("auth/login", {
          errorMessage: "Wrong credentials.",
        });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.password).then((isSamePassword) => {
        if (!isSamePassword) {
          return res.status(400).render("auth/login", {
            errorMessage: "Wrong credentials.",
          });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        //HERE I COULD ADD REDIRECTS DEPENDING ON USER ROLE
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      return res.status(500).render("login", { errorMessage: err.message });
    });
});

//////////LOG out
//get LOG OUT
router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    res.redirect("/");
  });
});

//ADMIN ROUTES
//Full list of Users
// router.get("/listUsers",checkRole(['ADMIN']),(req, res,next)=>{
//   User.find()
//   .populate('_organization')
//   .then((users) => {
//       res.render("listUsers", { users });
//   })
//   .catch((error) => {
//       console.log("error", error);
//       next();
//   });
// });


module.exports = router;