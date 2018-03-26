const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const UserAccount = mongoose.model('UserAccount')
const auth = require('../auth');
const path = require('path');

const FITBIT_CODE_URL = 'https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22CV92&redirect_uri=https%3A%2F%2Fmotivatr1.herokuapp.com%2Fapi%2Fuser%2Fhome&scope=activity%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight&expires_in=604800';

router.post('/users', function(req, res, next){
    let user = new UserAccount();

    user.username = req.body.username;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.setPassword(req.body.password);

    user.save().then(function(){
        return res.json({user: user.serialize()});
    }).catch(next);
});

router.post('/users/login', function(req, res, next){
    if(!req.body.email){
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if(!req.body.password){
        return res.status(422).json({error: {password: "can't be blank"}});
    }

    passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){return next(err); }

        if(user){
            user.token = user.generateJWT();
            return res.json({user: user.serialize(), redirect: '/api/user/fitbitAuth'}); //res.send({redirect: '../user/home'});
        } else {
            return res.status(422).json(info);
        }
    })
    (req, res, next);
});

router.get('/user/fitbitAuth', /*auth.required,*/ function(req, res, next){
    //UserAccount.findById(req.payload.id).then(function(user){
        //if(!user){return res.sendStatus(401);}

        return res.sendFile('dashboard.html', {root: './views'});
    });
//});

router.get('/user/home', function (req, res, next){
    let code = req.query.code;
    console.log(code);
})

router.get('/user', /*auth.required,*/ function(req, res, next){
    UserAccount.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401);}

        return res.json({user: user.serialize()})
    }).catch(next);
});

router.put('/user', /*auth.required,*/ function(req, res, next){
    UserAccount.findById(req.payload.id).then(function(user){
        if(!user){ return res.sendStatus(401); }

        //only update filedfs that were actually passed
        if(typeof req.body.user.username !== 'undefined'){
            user.username = req.body.user.username;
        }
        if(typeof req.body.user.email !== 'undefined'){
            user.email = req.body.user.email;
        }
        if(typeof req.body.user.phoneNumber !== 'undefined'){
            user.phoneNumber = req.body.user.phoneNumber;
        }
        if(typeof req.body.user.password !== 'undefined'){
            user.serPassword(req.body.user.password);
        }
        if(typeof req.body.user.motivatrPhoneNumber !== 'undefined'){
            user.motivatrPhoneNumber = req.body.user.motivatrPhoneNumber;
        }
        
        return user.save().then(function(){
            return res.json({user: user.serialize()});
        });
    }).catch(next);
});


module.exports = router;