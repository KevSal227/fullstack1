// we need this so we can find the punch by its ID
// it has to come from mongoose since thats what our db is using in server.js
const ObjectId = require('mongoose').Types.ObjectId

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

        // PROFILE PUNCHESSSSSSSSSSS
    // gets all the punches and sends them to the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        db.collection('punches').find().toArray((err, result) => {
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            punches: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });

    // PUNCH ROUTES TO SHOW WHERE ITS GOING AND HOW ITS GOING 

    // saves a new punch with the date and time
    app.post('/punches', (req, res) => {
      db.collection('punches').save({date: req.body.date, time: req.body.time}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    // route for delete, finds the punch by its id and deletes it from the database
    app.delete('/punches', (req, res) => {
      // if theres no id we stop here so it doesnt try to delete nothing
      if (!req.body.id) return res.status(400).send('no id sent')
      db.collection('punches').findOneAndDelete(
        // we are going to look for one punch with this id
        { _id: new ObjectId(req.body.id) },
        (err, result) => {
          // if something is broken itll send back the error
          if (err) return res.status(500).send(err)
          // this shows us in the terminal what got deleted, if its null nothing got deleted
          console.log('deleted:', result.value)
          // if it works itll send this back to our main.js
          res.send('Punch deleted!')
        })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}