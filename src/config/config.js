module.exports = {
    db_url: `mongodb://localhost:27017`,
    db_name: 'rbac',
    cookie_options: {
        httpOnly: true, sameSite: 'strict', secure: true, path: "/"
    }
}