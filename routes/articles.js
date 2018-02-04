const express = require('express');
const router = express.Router();

//BringIn Models
let Article = require('../models/article');
let User = require('../models/user');

//Access Control
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

//Add Get Route
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('add_article', {
        title:'Add Article'
    })
})

//Get Single Article Route
router.get('/:id', (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        User.findById(article.auther, (err, user)=>{
            res.render('article', {
                article:article,
                auther : user.name
            })
        })
    })
})

//Get Edit Article Route
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        if (article.auther != req.user._id) {
            req.flash('danger', 'Not Autherized.');
            res.redirect('/');
        }
        res.render('edit_article', {
        title:'Edit Article',
        article:article,
        })
    })
})

//Add Article Route
router.post('/add', ensureAuthenticated, (req, res)=>{
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('auther', 'Auther is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        res.render('add_article', {
            errors:errors,
            title:'Add Article',            
        })
    }else{
        let article = new Article();
        article.title = req.body.title;
        article.auther = req.user._id;
        article.body = req.body.body;
        article.save((err)=>{
            if (err) {
                console.log(err);
                return;
            }else{
                req.flash('success', 'Articel successfully added.')
                res.redirect('/');
            }
        })
    }
})

//Update Article Route
router.post('/edit/:id', ensureAuthenticated, (req, res)=>{
    let article = {};
    article.title = req.body.title;
    article.auther = req.body.auther;
    article.body = req.body.body;
    let query = {_id:req.params.id}
    Article.update(query, article, (err)=>{
        if (err) {
           console.log(err);
            return;
        }else{
            req.flash('info', 'Articel successfully updated.')            
            res.redirect('/');
        }
    })
})

//Articel Delete Route
router.delete('/:id', ensureAuthenticated, (req, res)=>{
    if(!req.user._id){
        res.status(500).send();
    }
    let query = {_id:req.params.id};
    Article.remove(query, (err)=>{
        if (err) {
            console.log(err);
        }
        req.flash('danger', 'Articel successfully deleted.')        
        res.send('Success');
    })
})

module.exports = router;