let mongoose = require('mongoose');
let requestSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
let userSchema = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    ProfileImageUrl: {
        type: String,
    },
    requests: [requestSchema],
    token: {
        type: String,
    },
    sessionExpiration: {
        type: String,
    },
    jwttoken: {
        type: String,
    },
    lastLogin: {
        type: Date,

    },

}, { timestamps: true });
module.exports = mongoose.model('User', userSchema);




