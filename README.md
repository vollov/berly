# About
MEAN restful authentication

# To run
1)start a local mongodb
2) run npm install
3) run bower install
4) run npm start
5) run npm test


# To add Packages
npm install --save pkg_name
npm install --save-dev pkg_name
bower install --save pkg_name


## jwt api

var jwt = require('jsonwebtoken');
var token = jwt.sign({username: req.body.username}, cfg.jwt.secret, {expiresIn:'14d'});

var expressJwt = require('express-jwt');
var jwt_auth = expressJwt({secret: cfg.jwt.secret, userProperty: 'payload'});
app.get('/api/protected', jwt_auth, function(req, res) {
	res.send('hello from /api/protected route.');
});
var users = require('./routes/users');
app.use('/api/', users);

## references
https://codeforgeek.com/2015/07/unit-testing-nodejs-application-using-mocha/

https://material.google.com/style/icons.html#icons-product-icons

https://scotch.io/tutorials/the-anatomy-of-a-json-web-token

https://github.com/auth0-blog/angularjs-jwt-authentication-tutorial

##Debug server code
 set DEBUG=express:* & node index.js



## npm command
npm list -g --depth=0
-S, --save: Package will appear in your dependencies.
-D, --save-dev: Package will appear in your devDependencies

## install node pkg
npm i body-parser express mongoose morgan errorhandler -S
npm i passport passport-local connect-mongodb-session serve-favicon method-override express-session multer --save

## run test
npm i grunt grunt-contrib-uglify grunt-contrib-nodeunit -D