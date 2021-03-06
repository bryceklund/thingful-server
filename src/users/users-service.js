const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return res.status(400).json({
                error: `Password should be longer than 8 characters`
            })
        }
        if (password.length > 72) {
            return res.status(400).json({
                error: `Password should be less than 72 characters`
            })
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return res.status(400).json({
                error: `Password must not start or end with spaces`
            })
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return res.status(400).json({
                error: `Password must contain 1 upper case, lower case, number, and special character`
            })
        }
    },
    hasUserWithUserName(db, user_name) {
        return db('thingful_users')
            .where({ user_name })
            .first()
            .then(user => !!user)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('thingful_users')
            .returning('*')
            .then(([user]) => user)
    },
    serializeUser(user) {
        return {
            id: user.id,
            full_name: xss(user.full_name),
            user_name: xss(user.user_name),
            nickname: xss(user.nickname),
            date_created: new Date(user.date_created)
        }
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    }
}

module.exports = UsersService