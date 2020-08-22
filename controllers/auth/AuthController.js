const User = require('./../../models/user');

module.exports.getLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    // console.log("Login Page Get Route: Session: ",req.session);
    // console.log("Login Page Get Route: Cookie: ",req.get('Cookie'));
    res.render('ejs-templates/auth/login', {
        pageTitle: "Login",
        path: '/login',
        isLoggedIn: req.session.isLoggedIn
    });
}

module.exports.postLogin = (req, res, next) => {
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    // old working with cookie // res.setHeader('Set-Cookie', 'new-cookie=working');
    User.findById('5f40941a8b8af870f61df2fa')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
                // console.log(err);
                res.redirect('/');
            })
        })
        .catch(err => console.log(err));
}

module.exports.postLogout = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect('/');
    }
    // old working with cookie // res.setHeader('Set-Cookie', 'new-cookie=working');
    req.session.destroy(() => {
        res.redirect('/');
    });
}