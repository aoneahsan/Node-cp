exports.getPageNotFound = (req, res, next) => {
    res.status(404).render('ejs-templates/404', {
        pageTitle: "404 | Not Found",
        path: '/404',
        isLoggedIn: req.session.isLoggedIn,
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
};