// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var session = require('express-session');
var passport = require('passport');
var beerController = require('./controllers/beer');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var oauth2Controller = require('./controllers/oauth2');
var clientController = require('./controllers/client');
const testingController = require('./controllers/testing');
const cors = require('cors');

// Connect to the beerlocker MongoDB
mongoose.connect('mongodb://localhost:27017/todo');

// Create our Express application
var app = express();

app.use(cors());

// Set view engine to ejs
app.set('view engine', 'ejs');

// Use the body-parser package in our application
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'Super Secret Session Key',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

// Serialize the user 
passport.serializeUser(function(user, done) {
    done(null, user);
});

// DeSerialize the user 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Create our Express router
var router = express.Router();

// Login and logout eps
router.post('/auth/login', authController.loginWithLocal, (req, res)=>{
    console.log(req.user);
    res.send({data: "Hello world"})
});

// Create endpoint handlers for /beers
router.route('/beers')
  .post(authController.isAuthenticated, beerController.postBeers)
  .get(authController.isAuthenticated, beerController.getBeers);

// Create endpoint handlers for /beers/:beer_id
router.route('/beers/:beer_id')
  .get(authController.isAuthenticated, beerController.getBeer)
  .put(authController.isAuthenticated, beerController.putBeer)
  .delete(authController.isAuthenticated, beerController.deleteBeer);

// Create endpoint handlers for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Create endpoint handlers for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients);

// Create endpoint handlers for oauth2 authorize
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Create endpoint handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);


// Testing 
app.route('/').get(testingController.ok);

app.route('/primes').get(testingController.primes);


// Register all our routes with /api
app.use('/api', router);



// Start the server
app.listen(3000, ()=> {
    console.log(`Application running on port 3000`);
});