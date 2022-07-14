// // routes/comments.routes.js

// const router = require('express').Router();

// const Comment = require('../models/Comment.model.js')

// router.get('/comments/create', (req, res) => res.render('comments/comment-create.hbs'));

// router.post('/comments/create', (req, res, next) => {
//     console.log(req.body);
//     const { title, author_name, content } = req.body;

//     Comment.create({ title, author_name, content })
//     .then(commentFromDB => console.log(`New comment created: ${commentFromDB.title}.`))
//     .catch(error => next(error));
// });

// // GET route to retrieve and display all the comments
// router.get('/feed', (req, res, next) => {
//     Comment.find()
//     .then(allTheCommentsFromDB =>{
      
//         console.log('Retrieved all comments from DB:', allTheCommentsFromDB)
      
//         res.render('comments/list-comments.hbs',{comments: allTheCommentsFromDB});
//     })
//     .catch(error=>{
//         console.log('Error while getting the comments from the DB: ',error)
//     next(error)
//     })
// })

// module.exports = router;
