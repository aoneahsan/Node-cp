module.exports = (req, res, next) => {
    if (req.session.isLoggedIn && req.session.user) {
        next();
    }
    else {
        return res.redirect('/');
    }
};