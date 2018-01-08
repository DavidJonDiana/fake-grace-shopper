const sequelize = require('sequelize');
const db = require('../index');
const bcryptjs = require('bcryptjs');
const _ = require('lodash')


const User = db.define('user', {
    name: {
        type: sequelize.STRING,
        allowNull: false
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: sequelize.STRING,
        allowNull: false
    }
})

const setSaltandPassword = (user, options) => {
    if (user.changed('password') || user.isNewRecord) {
        return bcryptjs.genSalt()
            .then(salt => {
                bcryptjs.hash(user.password, salt)
            })
            .then(hash => {
                user.password = hash
                return user
            })
            .catch(console.error)
    }
}

//hooks
User.beforeCreate(setSaltandPassword);
User.beforeUpdate(setSaltandPassword);

//instance methods

User.prototype.isCorrectPassword = function(input) {
    return bcryptjs.compare(input, this.password)
        .then(result => result)
        .catch(console.error)
}

User.prototype.sanitize = function () {
    return _.omit(this.toJSON(), ['password'])
}


module.exports = User;