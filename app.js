import express from "express"
import dotenv from "dotenv"
import expressEjsLayouts from "express-ejs-layouts"
import mainRoutes from "./server/routes/main.js"

const app = express()
const PORT = 3001 || process.env.PORT

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
