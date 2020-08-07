const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas} = require('../helper/routeHelper');
const userController = require('../controllers/users');

router.route('/signUp')
    .post(validateBody(schemas.authSchema), userController.signUp);
router.route('/signIn')
    .post(validateBody(schemas.authSchema), passport.authenticate('local',{session:false}), userController.signIn);
router.route('/oauth/google')
    .post(passport.authenticate('googleToken',{ session:false}),userController.googleOAuth);
router.route('/secret')
    .get(passport.authenticate('jwt',{session:false}),userController.secret);

module.exports = router;