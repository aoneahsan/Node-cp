exports.get404 = (req, res, next) => {
    res.status(404).render('ejs-templates/errors/404', {
        pageTitle: "404 | Not Found",
        path: '/404',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
};

exports.get500 = (req, res, next) => {
    res.render('ejs-templates/errors/500', {
        pageTitle: "500 | Server Side Issue",
        path: '/500',
        successMessage: req.flash('success'),
        warningMessage: req.flash('warning'),
        errorMessage: req.flash('error')
    });
};