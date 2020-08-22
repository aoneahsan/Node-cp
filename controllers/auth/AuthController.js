module.exports.getLogin = (req, res, next) => {
    res.render('ejs-templates/auth/login', {
        pageTitle: "Login",
        path: '/login'
    });
}