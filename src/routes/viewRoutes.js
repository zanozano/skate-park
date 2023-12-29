const express = require('express');
const router = express.Router();
const { getUsers } = require('../services/request');

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/signin');
    }
};

router.get('/', async (req, res) => {
    try {
        res.render('Home', { layout: 'main' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/skaters', async (req, res) => {
    try {
        res.render('SkaterList', { layout: 'main' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/signin', (req, res) => {
    try {
        res.render('Signin', { layout: 'secondary' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/signup', (req, res) => {
    try {
        res.render('Signup', { layout: 'secondary' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/admin', async (req, res) => {
    try {
        const users = await getUsers();
        res.render('Admin', { users, layout: 'main' });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/profile', isAuthenticated, (req, res) => {
    try {
        const user = req.session.user;
        res.render('Profile', { user, layout: 'main' });
    } catch (error) {
        handleError(res, error);
    }
});

function handleError(res, error) {
    console.error(`Error: ${error}`);
    res.status(500).send({
        error: `Something went wrong... ${error}`,
        code: 500,
    });
}

module.exports = router;
