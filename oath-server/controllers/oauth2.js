// Load required packages
var oauth2orize = require('oauth2orize')
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');
const { v4 } = require('uuid');
const { jwtService } = require('./../services/jwt');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(async function(id, callback) {
  try {
    const client = await Client.findOne({ _id: id })
    return callback(null, client);
  } catch (error) {
    return callback(error)
  }   
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(async function(client, redirectUri, user, ares, callback) {
  try {
    // Create a new authorization code
    const code = new Code({
      value: v4(),
      clientId: client._id,
      redirectUri: redirectUri,
      userId: user._id
    });

    // Save the auth code and check for errors
    const codeRes = await code.save()
    callback(null, codeRes.value);
  } catch (error) {
    return callback(error);
  }
}));

// Exchange authorization codes for access tokens.  The callback accepts the
// `client`, which is exchanging `code` and any `redirectUri` from the
// authorization request for verification.  If these values are validated, the
// application issues an access token on behalf of the user who authorized the
// code.

server.exchange(oauth2orize.exchange.code(async function(client, code, redirectUri, callback) {
  try {
    const authCode = await Code.findOne({ value: code })
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }
    // console.log(authCode);
    await Code.findByIdAndRemove(authCode?._id);
    const jwtToken = jwtService.generate({clientId:client._id, authCode:code})
    // Create a new access token
    var token = new Token({
      value: jwtToken,
      clientId: authCode.clientId,
      userId: authCode.userId
    });
    await token.save();
    callback(null, token);
  } catch (error) {
    return callback(error);
  }
}));

// user authorization endpoint
//
// `authorization` middleware accepts a `validate` callback which is
// responsible for validating the client making the authorization request.  In
// doing so, is recommended that the `redirectUri` be checked against a
// registered value, although security requirements may vary accross
// implementations.  Once validated, the `callback` callback must be invoked with
// a `client` instance, as well as the `redirectUri` to which the user will be
// redirected after an authorization decision is obtained.
//
// This middleware simply initializes a new authorization transaction.  It is
// the application's responsibility to authenticate the user and render a dialog
// to obtain their approval (displaying details about the client requesting
// authorization).  We accomplish that here by routing through `ensureLoggedIn()`
// first, and rendering the `dialog` view. 

exports.authorization = [
  server.authorization(async function(clientId, redirectUri, callback) {
    try {
      const client = await Client.findOne({ id: clientId });
      return callback(null, client, redirectUri);
    } catch (error) {
      return callback(error);
    }
  }),
  function(req, res){
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint
//
// `decision` middleware processes a user's decision to allow or deny access
// requested by a client application.  Based on the grant type requested by the
// client, the above grant middleware configured above will be invoked to send
// a response.

exports.decision = [
  server.decision()
]

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
  server.token(),
  server.errorHandler()
]