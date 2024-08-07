const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const PortfolioHistorySchema = new Schema({
    date: { type: Date, default: Date.now },
    totalWorth: { type: Number, required: true }
});

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    portfolio: {
        type: []
    },
    nfts: {
        type: []
    },
    portfolioHistory: [PortfolioHistorySchema]

})

UserSchema.pre("save", function(next) {
    const user = this
    if(!user.isModified("password")) return next()

    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) return next(err)
        user.password = hash
        next()
    })
})

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.generateJWT = function () {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + process.env.JWT_EXP_DAYS)

    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            exp: parseInt(exp.getTime() / 1000),
        },
        process.env.JWT_SECRET
    )
}

UserSchema.methods.toAuthJSON = function () {
    return{
        email: this.email,
        token: this.generateJWT(),
    }
}

const User = mongoose.model("User", UserSchema)

module.exports = User