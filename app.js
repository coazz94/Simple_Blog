import express from "express"
import dotenv from "dotenv"
import expressEjsLayouts from "express-ejs-layouts"
import mainRoutes from "./server/routes/main.js"
import connectDB from "./server/config/db.js"
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Connect to DB
connectDB()

//
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Use the public folder
app.use(express.static("public"))

//Template Engine
app.use(expressEjsLayouts)
app.set("layout", "./layouts/main")
app.set("view engine", "ejs")

app.use("", mainRoutes)

app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`)
})
