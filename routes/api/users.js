const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const UserAccount = mongoose.model('UserAccount')
const auth = require('../auth');

router.post('/users', function(req, res, next){
    let user = new UserAccount();

    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.phoneNumber = req.body.user.phoneNumber;
    user.setPassword(req.body.user.password);

    user.save().then(function(){
        return res.json({user: user.serialize()});
    }).catch(next);
});

router.post('/users/login', function(req, res, next){
    if(!req.body.user.email){
        return res.status(422).json({errors: {email: "can't be blank"}});
    }

    if(!req.body.user.password){
        return res.status(422).json({error: {password: "can't be blank"}});
    }

    passport.authenticate('local', {session: false}, function(err, user, info){
        if(err){return next(err); }

        if(user){
            user.token = user.generateJWT();
            return res.json({user: user.serialize()});
        } else {
            return res.status(422).json(info);
        }
    })(req, res, next);
});

router.get('/user', auth.required, function(req, res, next){
    UserAccount.findById(req.payload.id).then(function(user){
        if(!user){return res.sendStatus(401);}

        return res.json({user: user.serialize()})
    }).catch(next);
});

router.put('/user', auth.required, function(req, res, next){
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