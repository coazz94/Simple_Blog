import express from "express"
import Post from "../models/Post.js"

const router = express.Router()

// Setup pages
router.get("/", async (req, res) => {
    const locals = {
        title: "Node Js Blog",
        description: "Test Blog with Node Js",
    }

    try {
        const data = await Post.find()
        res.render("index", { locals, data })
    } catch (error) {
        console.log(error)
    }
})

//GET POST
router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id

        const data = await Post.findById({ _id: slug })

        const locals = {
            title: data.title,
            description: data.article,
        }

        res.render("post", { locals, data })
    } catch (error) {
        console.log(error)
    }
})

router.get("/about", (req, res) => {
    res.render("about")
})

router.post("/search", async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Search Bar",
        }

        let searchTerm = req.body.searchTerm
        const cleanTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(cleanTerm, "i") } },
                { body: { $regex: new RegExp(cleanTerm, "i") } },
            ],
        })

        res.render("search", {
            locals,
            data,
        })
    } catch (error) {}
})

export default router
