require('dotenv').config();

module.exports = {
    db_url: `mongodb+srv://expressrbac:${process.env.password}@rbac.pq3evnb.mongodb.net/?retryWrites=true&w=majority`,
    db_name: 'rbac',
    cookie_options: {
        httpOnly: true, sameSite: 'strict', secure: true, path: "/"
    }
}