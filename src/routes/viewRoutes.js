const express = require('express');
const router = express.Router();
const { getUsers } = require('../services/request');

router.get('/', async (req, res) => {
    try {
        res.render('Home', { layout: 'main' });
    } catch (e) {
        handleError(res, e);
    }
});

router.get('/skaters', async (req, res) => {
    try {
        res.render('SkaterList', { layout: 'main' });
    } catch (e) {
        handleError(res, e);
    }
});

router.get('/signin', (req, res) => {
    res.render('Signin', { layout: 'secondary' });
});

router.get('/signup', (req, res) => {
    res.render('Signup', { layout: 'secondary' });
});

router.get('/admin', async (req, res) => {
    try {
        const usuarios = await getUsers();
        res.render('Admin', { usuarios, layout: 'main' });
    } catch (error) {
        handleError(res, error);
    }
});

const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.redirect('/signin');
    }
};

router.get('/profile', isAuthenticated, (req, res) => {
    const user = req.session.user;
    res.render('Profile', { user, layout: 'main' });
});

function handleError(res, error) {
    console.error(`Error: ${error}`);
    res.status(500).send({
        error: `Something went wrong... ${error}`,
        code: 500,
    });
}

module.exports = router;
