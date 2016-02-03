var express = require('express');
var router = express.Router();
var global = require('../global.js');
var bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var Model = require('../lib/models/userModel');
var User = Model.getModel();
//var storeModel = require('../lib/models/storeModel');
//var store = storeModel.getModel();
var crypto = require('crypto');
var md5sum = crypto.createHash('md5');
var SALT_WORK_FACTOR = 10;




function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var key = makeid();

var mailId = crypto.createHash('md5').update(key).digest("hex");
// create reusable transport method (opens pool of SMTP connections)
var transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "ezell@thebigneed.com",
        pass: "Robbins9@"
    }
});

router.post('/register', function(req, res){
    // res.send('it works from here!!')

    var name = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var myTest = new User({});
    var key = Math.random();
    // console.log(Person.findOne({}));
    // console.log(User.findOne({}));
    // res.send("ok");
    // console.log(email);
    var userModel = new User({'email':email, 'name':name, 'password': password});


    //ok lets check that there is not the same email already in the system denoting that the user is already registered
    User.findOne({'email' : email }, function(err, user){


        if(!user){
            bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
                if(err){
                    res.send(err);
                }

                //hash the password along with the new salt
                bcrypt.hash(userModel.password, salt, function(err, hash){
                    userModel.password = hash;
                    userModel.salt = salt;
                    userModel.verificationNum = mailId;
                    // console.log("the password is "+userModel.password);
                    userModel.save();
                } )

                //we saved the model to the db now we will send an email to verify
                // send mail with defined transport object
                var mailOptions = {
                    from: "thebigneed <ezell@thebigneed.com>", // sender address
                    to: email, // list of receivers
                    subject: "thebigneed email Verification Required", // Subject line
                    text: "Thank you for registering with us, you are now apart of the difference,", // plaintext body
                    html: '<b>Thank you for registering with us, you are now apart of the difference </b><p>http://thebigneed.com/verify?'+mailId+'<p/>' // html body
                }
                var mailOptions2 = {
                    from: "thebigneed <ezell@thebigneed.com>", // sender address
                    to: "info@thebigneed.com", // list of receivers
                    subject: "we got a register!!!", // Subject line
                    text: 'from '+email, // plaintext body
                    html: '<b>Thank you for registering with us, you are now apart of the difference </b><p>http://thebigneed.com/verify?'+mailId+'<p/>' // html body
                }
                transport.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    // smtpTransport.close(); // shut down the connection pool, no more messages
                });
                transport.sendMail(mailOptions2, function(error, response){
                    if(error){
                        console.log(error);
                    }else{
                        console.log("Message sent: " + response.message);
                    }

                    // if you don't want to use this transport object anymore, uncomment following line
                    // smtpTransport.close(); // shut down the connection pool, no more messages
                });

            })


            // res.send('Thank you for registering');
            res.json({'success':true, 'message' : 'Thank you for registering please check your email to verify.' });



        }else{

            console.log('someone is already registered');
            // res.send('Someone is already registered');
            res.json({'success':false, 'message' : 'Someone is already registered, please try again.' });
            // res.redirect('/')
        }

    })

});