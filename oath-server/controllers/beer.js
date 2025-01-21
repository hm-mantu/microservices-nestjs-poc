// Load required packages
var Beer = require('../models/beer');

// Create endpoint /api/beers for POST
exports.postBeers = async function(req, res) {
    try {
          // Create a new instance of the Beer model
        var beer = new Beer();

        // Set the beer properties that came from the POST data
        beer.name = req.body.name;
        beer.type = req.body.type;
        beer.quantity = req.body.quantity;
        beer.userId = req.user._id;

        // Save the beer and check for errors
        await beer.save();
        res.json({ message: 'Beer added to the locker!', data: beer });
    } catch (error) {
        return res.send(error);
    }
};

// Create endpoint /api/beers for GET
exports.getBeers = async function(req, res) {
  // Use the Beer model to find all beer
  try {
    const beers = await Beer.find({ userId: req.user._id });
    res.json(beers);
  } catch (error) {
    return res.send(error);
  }
};

// Create endpoint /api/beers/:beer_id for GET
exports.getBeer = async function(req, res) {
  // Use the Beer model to find a specific beer
  try {
    const beer = await Beer.find({ userId: req.user._id, _id: req.params.beer_id });
    res.json(beer);
  } catch (error) {
    return res.send(error);
  }
};

// Create endpoint /api/beers/:beer_id for PUT
exports.putBeer = async function(req, res) {
  // Use the Beer model to find a specific beer
  try {
    const num = await Beer.update({ userId: req.user._id, _id: req.params.beer_id }, { quantity: req.body.quantity })
    res.json({ message: num + ' updated' });
  } catch (error) {
    return res.send(error);
  }
};

// Create endpoint /api/beers/:beer_id for DELETE
exports.deleteBeer = async function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  try { 
    await Beer.remove({ userId: req.user._id, _id: req.params.beer_id });
    res.json({ message: 'Beer removed from the locker!' });
  } catch (error) {
    return res.send(error);
  }
  
};