// routes/comments.routes.js
const router = require('express').Router();
const  User = require('../models/User.model')
const Post = require('../models/Post.model')
const isLoggedIn = require("../middleware/isLoggedIn");
const {checkRole} =require("../middleware/checkRole")
//url is /forum/

// read FORUM get
// router.get('/', isLoggedIn, checkRole(["USER", "ORG", "ADMIN"]), async (req,res,next)=>{
//     const {user} = req.session
//     try{
//  const post = Post.find().populate({path: '_author', model:User})
//   res.render("post/forum", {post, user})
//   }catch(error){res.status(500).json({ error });
//     console.log(error)}
// })
router.get('/', isLoggedIn, checkRole(["USER", "ORG", "ADMIN"]), (req,res,next)=>{
        const {user} =req.session

    Post.find().sort({ date: -1 }).limit(20)
    .populate({path: '_author', model:User})
    .then(posts=>{
        res.render("post/forum",{posts, user})
    })
})

router.get('/create-comment',(req,res,next)=>{
    res.render("blog/new-comment",{userInSession: req.session.currentUser})
})


// create FORUM get
router.get('/create', isLoggedIn, checkRole(["USER", "ORG", "ADMIN"]),(req,res,next)=>{
        const {user} = req.session
        res.render("post/create-post", {user})
})
// create FORUM post
router.post('/create', isLoggedIn, checkRole(["USER", "ORG", "ADMIN"]), async (req,res,next)=>{
    const {user} = req.session
    const {copy } =req.body
    try{
        console.log("user", user)
          const post = await  Post.create({copy, _author: user._id})
  
        res.redirect("/forum")

    }catch(error){res.status(500).json({ error });
    console.log(error)}
})

//delete FORUM gwt
router.get("/delete/:id", isLoggedIn, checkRole(["USER", "ORG", "ADMIN"]),(req,res,next)=>{
    const {id}= req.params

    Post.findByIdAndDelete(id)
    .then(()=>{
        res.redirect("/forum")
    })
.catch(error => next(error))
})

//exports
module.exports = router;
