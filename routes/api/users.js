const mongoose = require('mongoose');
const router = require('express').Router();
const passport = require('passport');
const UserAccount = mongoose.model('UserAccount')
const auth = require('../auth');
const path = require('path');
const https = require('https');
const querystring = require('querystring')

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
            return res.json({user: user.serialize(), redirect: '/api/user/fitbitAuth'}); 
        } else {
            return res.status(422).json(info);
        }
    })
    (req, res, next);
});

router.get('/user/fitbitAuth', /*auth.required,*/ function(req, res, next){
    //UserAccount.findById(req.payload.id).then(function(user){
        //if(!user){return res.sendStatus(401);}

        return res.sendFile('fitbitAuth.html', {root: './views'});
    });
//});

router.post('/user/fitbitAuthToken', function (req, res, next){
    let code = req.body.code;
    let fbTokens = '';

    const options = {
        hostname: 'api.fitbit.com',
        method: 'POST',
        path: '/oauth2/token',
        headers: {"Authorization": "Basic MjJDVjkyOjQ5MWZkZTI3MzgzMDZjMTUxOTU0NzVkMzI0Yzg3ZTU1",
        "Content-Type": "application/x-www-form-urlencoded"}
    };
    const query = querystring.stringify({
        clientId: '22CV92',
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:8080/api/user/home',
        code: code
    });

    const request = https.request(options, (response) => {
        response.on('data', (chunk) => {
            fbTokens += chunk;
        });

        response.on('end' , () => {
            return new Promise((resolve, reject) => {
                UserAccount.findById(req.body.id)
                .then(user =>{
                    if(!user){
                        return res.sendStatus(404);
                    }
                    resolve(user);    
                }).catch(err => {reject(err)})
            })
            .then(function(user){
                fbTokens = (JSON.parse(fbTokens));

                user.fb_auth_token = fbTokens.access_token;
                user.fb_refresh_token = fbTokens.refresh_token;
                user.fb_id = fbTokens.user_id;

                user.save().then(function(err){
                    if(err){return res.sendStatus(404)}
                });
            });
        });

        response.on('error', (err) => {
            console.log("Error:" + err.message);
        });
    });
    request.write(query);
    request.end()
});


router.get('/user/home', function(req, res, next){
    if(req.query.code){
        return res.sendFile('fitbitAuthToken.html', {root: './views'})
    }
});

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
            user.setPassword(req.body.user.password);
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