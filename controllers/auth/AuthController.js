const User = require('./../../models/user');
const bcrypt = require('bcryptjs');

module.exports.getLogin = (req, res, next) => {
    res.render('ejs-templates/auth/login', {
        pageTitle: "Login",
        path: '/login',
        isLoggedIn: req.session.isLoggedIn,
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
}

module.exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', "Invalid Data Entered");
                return res.redirect('/login');
            } else {
                return bcrypt.compare(password, user.password)
                    .then(validPassword => {
                        if (!validPassword) {
                            req.flash('warning', "Invalid Data Entered");
                            return res.redirect('/login');
                        }
                        else {
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save((err) => {
                                req.flash('success', "Welcome Back " + user.name + '!');
                                return res.redirect('/');
                            });
                        }
                    });
            }
        })
        .catch(err => console.log(err));
}

module.exports.getRegister = (req, res, next) => {
    res.render('ejs-templates/auth/register', {
        pageTitle: "Register",
        path: '/register',
        isLoggedIn: req.session.isLoggedIn,
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
}

module.exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password_confirm = req.body.password_confirm;
    if (password !== password_confirm) {
        req.flash('warning', "Password Not Matched");
        return res.redirect('/register');
    }
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return bcrypt.hash(password, 12)
                    .then(hashedPassword => {
                        return User.create({
                            name: name,
                            email: email,
                            password: hashedPassword,
                            cart: { items: [] }
                        })
                            .then(registeredUser => {
                                if (!registeredUser) {
                                    req.flash('error', "Error Occured while registeration process, please try again.");
                                    return res.redirect('/register');
                                }
                                req.session.isLoggedIn = true;
                                req.session.user = registeredUser;
                                return req.session.save((err) => {
                                    req.flash('success', "Welcome " + registeredUser.name + ", you are registered successfully!");
                                    return res.redirect('/');
                                });
                            })
                            .catch(err => console.log(err));
                    })
                    .catch(err => console.log(err));
            }
            else {
                req.flash('error', "User already exists with this email.");
                return res.redirect('/register');
            }
        })
        .catch(err => console.log(err));
}

module.exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}