const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { JsonWebTokenError } = require('jsonwebtoken');
// salt가 몇자리인지 알려주는 변수
const saltRounds = 10

const jwt = require('JsonWebToken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlenth: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastnname: {
        type: String,
        maxlenth: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
})

userSchema.pre('save', function (next) {
    var user = this
    if (user.isModified('password')) {
        // 비밀번호를 암호화 시킨다.
        // salt를 이용해서 비밀번호를 암호화 해야함 
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) { 
                if (err) return next(err)
                // post man에서 넘어온 비밀번호를 hash로 바꾼다.
                user.password = hash
                next()
            });
        });
    }
    else {
        next()
    }
})

// cb -> callback
userSchema.methods.comparePassword = function (plainPassword, cb) { 
    // plainPassword => 1234567 와 암호화된 비밀번호와 비교
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 token을 생성하기
    // user._id + 'secretToken' = token
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token;
    user.save(function (err, user) { 
        if (err) return cb(err)
        cb(null, user)
    })
}


const User = mongoose.model('User', userSchema)

module.exports = { User }