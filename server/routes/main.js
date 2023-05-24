import express from "express"

const router = express.Router()

// Setup pages
router.get("/", (req, res) => {
    const locals = {
        title: "Node Js Blog",
        description: "Test Blog with Node Js",
    }

    res.render("index", locals)
})

router.get("/about", (req, res) => {
    res.render("about")
})

export default router
