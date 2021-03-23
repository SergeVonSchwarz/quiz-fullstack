const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const passport = require("passport")
const keys = require("./config/keys")

const authRoutes = require("./routes/auth")
const answersRoutes = require("./routes/answers")

const app = express()

mongoose
    .connect(keys.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.log("MongoDB connection error: ", err))

app.use(passport.initialize())
require("./middleware/passport")(passport)

app.use(require("morgan")("dev"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require("cors")())

app.use("/api/auth", authRoutes)
app.use("/api/answers", answersRoutes)

module.exports = app
