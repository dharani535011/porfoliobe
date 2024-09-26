const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const node = require("nodemailer")

// MIDDLEWARE
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}))
// SCHEMA & MODEL
const detialSchema = new mongoose.Schema({
    name: String,
    mail: String,
    message: String
})
const Details = mongoose.model("Details", detialSchema, "portfolio-visitors")
// REQUIRED
app.post("/details", async (req, res) => {
    const { name, mail, message } = req.body
    try {
        if (!name || !mail || !message) {
            return res.send({ message: "value is missing" })
        }
        const re = new Details({
            name, mail, message
        })
        await re.save()
        const transport = node.createTransport({
            service: "gmail",
            auth: {
                user: "dharani535011@gmail.com",
                pass: process.env.password
            }
        })
        transport.sendMail({
            from: "dharani535011@gmail.com",
            to: "dharani535011@gmail.com",
            subject: "New Visitor...!",
            text: `
                Name      :${re.name}
                Email     :${re.mail}
                Message   :${re.message}
                `
        })
        res.send({ message: "Thank You.." })
    } catch (error) {
        res.send({ message: error.message })
    }
})




// DATABASE & SERVER
mongoose.connect(process.env.mongodb)
    .then(() => {
        console.log("DATABASE CONNECTED")
        app.listen(3000, () => {
            console.log("SERVER CONNECTED")
        })
    })