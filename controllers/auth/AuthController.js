const User = require('./../../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const appKeys = require('./../../utils/app-keys');

const mailTransporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: appKeys.sendgridAPIKey
    }
}))

module.exports.getLogin = (req, res, next) => {
    res.render('ejs-templates/auth/login', {
        pageTitle: "Login",
        path: '/login',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error'),
        errors: [],
        oldInputs: {
            email: '',
            password: ''
        }
    });
}

module.exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('ejs-templates/auth/login', {
            pageTitle: "Login",
            path: '/login',
            successMessage: req.flash('success'),
            warningMessage: req.flash('warning'),
            errorMessage: req.flash('error'),
            errors: errors.array(),
            oldInputs: {
                email: email,
                password: password
            }
        });
    }
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
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while logging in.";
            return next(error);
        });
}

module.exports.getRegister = (req, res, next) => {
    res.render('ejs-templates/auth/register', {
        pageTitle: "Register",
        path: '/register',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error'),
        errors: [],
        oldInputs: {
            name: "",
            email: "",
            password: "",
            password_confirm: ""
        }
    });
}

module.exports.postRegister = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const password_confirm = req.body.password_confirm;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("errors: ", errors.array());
        return res.status(422).render('ejs-templates/auth/register', {
            pageTitle: "Register",
            path: '/register',
            successMessage: req.flash('success'),
            warningMessage: req.flash('warning'),
            errorMessage: req.flash('error'),
            errors: errors.array(),
            oldInputs: {
                name: name,
                email: email,
                password: password,
                password_confirm: password_confirm
            }
        });
    }
    else {
        bcrypt.hash(password, 12)
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
                            res.redirect('/');
                            return mailTransporter.sendMail({
                                to: email,
                                from: appKeys.fromEmailAddress,
                                subject: "Signup Completed - Welcome " + name,
                                html: "<h1>Hi, welcome to this community, we wish you a great journy with us :)"
                            }).then(result => {
                            }).catch(err => {
                                console.log("Signup Email Sending Failed!", err);
                            });
                        });
                    })
                    .catch(err => {
                        let error = new Error(err);
                        error.httpStatusCode = 500;
                        error.message = "Error while registring user.";
                        return next(error);
                    });
            })
            .catch(err => {
                let error = new Error(err);
                error.httpStatusCode = 500;
                error.message = "Error while registring user.";
                return next(error);
            });
    }
}

module.exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
}

module.exports.getResetPassword = (req, res, next) => {
    res.render('ejs-templates/auth/reset-password', {
        pageTitle: "Reset Password",
        path: '/reset-password',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
}

module.exports.postResetPassword = (req, res, next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            req.flash('error', "Something went wrong!");
            return res.redirect('/reset');
        } else {
            let resetToken = buffer.toString('hex');
            let resetTokenExpreIn = Date.now() + 3600000;
            User.findOne({ email: email })
                .then(user => {
                    if (!user) {
                        req.flash('error', "no user found!");
                        return res.redirect('/reset');
                    }
                    else {
                        user.resetToken = resetToken;
                        user.resetTokenExpreIn = resetTokenExpreIn;
                        user.save()
                            .then(result => {
                                if (!result) {
                                    req.flash('error', "Error Occured, try again!");
                                    return res.redirect('/reset');
                                }
                                mailTransporter.sendMail({
                                    to: email,
                                    from: appKeys.fromEmailAddress,
                                    subject: "Reset Password Link",
                                    html: `
                                    <p>You request a reset password link</p>
                                    <p>click the <a href="${appKeys.appRootURL}/reset/${resetToken}">link</a> to reset your account password</p>
                                    `
                                });
                                req.flash('success', "Password Reset Mail Send, Check your Email!");
                                return res.redirect('/reset');
                            }).catch(err => {
                                let error = new Error(err);
                                error.httpStatusCode = 500;
                                error.message = "Error while requesting reset password link.";
                                return next(error);
                            });
                    }
                })
                .catch(err => {
                    let error = new Error(err);
                    error.httpStatusCode = 500;
                    error.message = "Error while requesting reset password link.";
                    return next(error);
                })
        }
    })
}

module.exports.getNewPassword = (req, res, next) => {
    const resetToken = req.params.token;
    if (!resetToken) {
        req.flash('warning', 'Something went wrong!');
        return res.redirect('/login');
    }
    res.render('ejs-templates/auth/update-password', {
        pageTitle: "Update Password",
        path: '/update-password',
        resetToken: resetToken,
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
}

module.exports.postNewPassword = (req, res, next) => {
    const resetToken = req.params.token;
    if (!resetToken) {
        req.flash('warning', 'Something went wrong!');
        return res.redirect('/login');
    }
    const password = req.body.password;
    const password_confirm = req.body.password_confirm;
    if (password !== password_confirm) {
        req.flash('warning', 'Password didn`t match!');
        return res.redirect(`${appKeys.appRootURL}/reset/${resetToken}`);
    }
    let currentDate = Date.now();
    User.findOne({ resetToken: resetToken, resetTokenExpreIn: { $gt: currentDate } })
        .then(user => {
            if (!user) {
                req.flash('error', 'Something went wrong!');
                return res.redirect('/login');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    if (!hashedPassword) {
                        req.flash('error', 'Something went wrong!');
                        return res.redirect('/login');
                    }
                    else {
                        user.password = hashedPassword;
                        user.resetToken = null;
                        user.resetTokenExpreIn = null;
                        return user.save((err) => {
                            if (err) {
                                req.flash('error', 'Something went wrong!');
                                return res.redirect('/login');
                            }
                            req.session.isLoggedIn = true;
                            req.session.user = user;
                            return req.session.save((err) => {
                                req.flash('success', "Welcome " + user.name + ", your password has been reset successfully!");
                                res.redirect('/');
                            });
                        })
                    }
                })
                .catch(err => {
                    let error = new Error(err);
                    error.httpStatusCode = 500;
                    error.message = "Error while updating password.";
                    return next(error);
                })
        })
        .catch(err => {
            let error = new Error(err);
            error.httpStatusCode = 500;
            error.message = "Error while updating password.";
            return next(error);
        })
}