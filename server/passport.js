// var FACEBOOK_ID = '932055926922953';
// var FACEBOOK_CALLBACK_URL = 'http://localhost:4040/facebookLogin/Callback'
// var FACEBOOK_SECRET = 'c283a4b04e8635a09c8ac2d0ed071e30'
var INSTAGRAM_ID = '11aeef855e224c23ab73786f79c3f1d1';
var INSTAGRAM_CALLBACK_URL = 'http://localhost:4040/instagramLogin/Callback';
var INSTAGRAM_SECRET = '';	// *** enter secret 
var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var InstagramStrategy = require('passport-instagram').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;
var path       = require('path');
var db         = require(path.join(__dirname, './db.js'));
var Utils      = require(path.join(__dirname, './utils.js'));


module.exports = function(passport){

  passport.serializeUser(function(user, callback){
    console.log("HEY THERE")
    console.log("SUSERS", user , callback)
    callback(null, user.userID || user.instagramID || user)
  });

  passport.deserializeUser(function(id,callback){
    console.log("Decerael")
    findUserByID(id).then(value => {
      if (value) done(null, value)
      else done('no session', value)
    })
  })

  passport.use('local-signup', new LocalStrategy(
    function(username,password,callback){
      process.nextTick(function(){
        console.log('Local', username, password, callback)
        db.collection('users').find({username: username}).then((user) => {
          console.log("user", user)
          if(user.length > 0){
              if(user[0].username){
                //, flash('signUpMessage', 'Username taken')
                  return callback(null, false);
              }
          }
          else {
            console.log("ESEESE", password)
            return Utils.hashPassword(password).then(function(hash) {
              console.log("HASSSSHH", hash)
              return db.collection('users').insert({username: username, password: hash})
            })
            .then(function(obj) {
              var sessionId = Utils.createSessionId();
              return db.collection('sessions').insert({id: obj._id, sessionId: sessionId});
            })
            .then(function(obj) {
              console.log("OBJOBJOBJ", callback)
              console.log('SIGNUP USERID SUCCESS', {userID:obj})
              return callback(null, {userID:obj})
            })
          }
        })
      })
    }
  ))

  passport.use('local-login', new LocalStrategy(
    function(username, password, callback) {
      console.log('LOCAL LOGIN', username, password, callback)
      process.nextTick(function() {
        db.collection('users').find({username: username}).then((user) => {
          console.log('USERVALUE', user)
          if(user.length > 0) {
            Utils.comparePassword(user[0].password, password).then(val => {
              if (val === true) {
                console.log('CORRECT PASSWORD')
                return callback(null, user[0]);
              } else {
                console.log('user exists, but wrong password')
                //, flash('badPass', 'Incorrect password')
                return callback(null, false);
              }
            })
            .catch(val => {
              console.log('Password incorrect', val);
              // , flash('badPass', 'Incorrect password')
              return callback(null, false);
            })
          } else {
            console.log('User not found');
            //, flash('noUser', 'Username not found')
            return callback(null, false);
          }
        })
      })
    }
  ))

  passport.use(new InstagramStrategy({
    clientID: INSTAGRAM_ID,
    clientSecret: INSTAGRAM_SECRET,
    callbackURL: INSTAGRAM_CALLBACK_URL
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function () {
      db.collection('users').find({instagramID: profile.id}).then(user => {
        if (user.length > 0) {
          return done(null, user[0])
        }
        else {
          addInstagramUser(profile, token).then(userVal => {
            console.log('DONE', done);
            console.log('USERVAL', userVal)
            return done(null, userVal);
          })
        }
      })
    });
  }));

}

function addInstagramUser(user, token) {
	console.log('USER',user, 'TOKEN', token)
	// return db.collection('users').find({username: user.emails[0].value}).then(exists => {
  //   console.log('inside existing IG user')
  //   if(exists.length > 0) {
  //     return db.collection('users').find({username: user.emails[0].value}).update({
  //       instagramID: user.id,
  //       instagramToken: token,
  //       instagramEmail: user.emails[0].value
  //     })
  //   }
    // else {
      console.log('inside inserting IG user')
      return db.collection('IGusers').insert({
        instagramID: user.id,
        instagramToken: token
        // instagramEmail: user.emails[0].value
      })
    // }
  // })
  // .catch(err => {console.log('ERRRRORRRRR', err)})
}


var findUserByID = function(ID) {
 	console.log("FINDUSERID", ID)
	return db.collection('IGusers').find({
		instagramID : ID
	}).then(value => {
		console.log('valueIDID',value)
		if (value.length > 0) {
			return value[0];
		}
		return false;
	})
}
