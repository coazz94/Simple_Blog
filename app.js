import express from "express"
import dotenv from "dotenv"
import expressEjsLayouts from "express-ejs-layouts"
import mainRoutes from "./server/routes/main.js"
import adminRoutes from "./server/routes/admin.js"
import connectDB from "./server/config/db.js"
import cookieParser from "cookie-parser"
import MongoStore from "connect-mongo"
import session from "express-session"
import methodOverride from "method-override"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Connect to DB
connectDB()

// Cookie Parser
const cookie = cookieParser()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookie)

app.use(methodOverride("_method"))

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
    })
)

// Use the public folder
app.use(express.static("public"))

//Template Engine
app.use(expressEjsLayouts)
app.set("layout", "./layouts/main")
app.set("view engine", "ejs")

app.use("/", mainRoutes)
app.use("/", adminRoutes)

app.listen(PORT, () => {
    console.log(`App listening on Port: ${PORT}`)
})
