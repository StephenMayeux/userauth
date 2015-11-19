var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
     'title': 'Register' 
  });
});

router.get('/login', function(req, res, next) {
  res.render('login', {
     'title': 'Login' 
  });
});

router.post('/register', function(req, res, next) {
  // validate the form
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  
    // check the image field
  if(req.files.profileimage) {
    console.log('uploading file');
    
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileimage.name;
    var profileImageMime = req.files.profileimage.mimetype;
    var profileImagePath = req.files.profileimage.path;
    var profileImageExt = req.files.profileimage.extension;
    var profileImageSize = req.files.profileimage.size;
  } else {
    // set a default image
    var profileImageName = 'noimage.png';
  }
  
  // form validation
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'passwords do not match').equals(req.body.password);
  
  //check for errors
  var errors = req.validationErrors();
  
  if (errors) {
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  } else {
    var newUswer = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileimage: profileImageName
    });
  }
  
  // create user
  User.createUser(newUswer, function(err, user) {
    if (err) throw err;
    console.log(user);
  });
  
  // success message
  req.flash('success', 'You are now registered');
  res.location('/');
  res.redirect('/');
});

module.exports = router;
