import express from "express"
import User from "../models/User.js"
import Post from "../models/Post.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const adminLayout = "../views/layouts/admin.ejs"
const router = express.Router()

/* Auth Middleware */
const authMiddleware = (req, res, next) => {
    const token = req.cookies.token

    if (!token) {
        res.status(401).json({ message: "no access" })
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.userId = decoded.userId
            next()
        } catch (error) {
            res.status(401).json({ message: "no access" })
        }
    }
}

/* GET / Admin - Login Page */
router.get("/admin", async (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Admin Page",
        }

        res.render("admin", { locals, layout: adminLayout })
    } catch (error) {
        console.log(error)
    }
})

/** POST LOGIN - Login user */
router.post("/admin", async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(401).json({ message: "invalid Credentials" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ message: "invalid Credentials" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        res.cookie("token", token, { httpOnly: true })

        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

/** POST Register - Register user */
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body

        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        try {
            const user = await User.create({
                username,
                password: hashedPassword,
            })
            res.status(201).json({ message: "User created", user })
        } catch (error) {
            if (error.code === 11000) {
                res.status(409).json({ message: "User exists" })
            }
            res.status(500).json({ message: "Server error" })
        }
    } catch (error) {
        console.log(error)
    }
})

/* GET /Dashboard - getDashboard site */
router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Dashboard",
            description: "Simple Blog created with NodeJs, Express & MongoDb.",
        }

        const data = await Post.find()
        res.render("admin/dashboard", {
            locals,
            data,
            layout: adminLayout,
        })
    } catch (error) {
        console.log(error)
    }
})

/* GET Admin - create a new Post */
router.get("/add-post", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Add Post",
            description: "Simple Blog",
        }

        res.render("admin/add-post", {
            locals,
            layout: adminLayout,
        })
    } catch (error) {
        console.log(error)
    }
})

/* POST Admin - Add a new Post */
router.post("/add-post", authMiddleware, async (req, res) => {
    try {
        try {
            const newPost = new Post({
                title: req.body.title,
                body: req.body.body,
            })

            await Post.create(newPost)
            res.redirect("/dashboard")
        } catch (error) {
            console.log(error)
        }
    } catch (error) {
        console.log(error)
    }
})

/* GET Admin - Edit a new Post */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: "Edit Post",
            description: "Free NodeJs User Management System",
        }

        const data = await Post.findOne({ _id: req.params.id })

        res.render("admin/edit-post", {
            locals,
            data,
            layout: adminLayout,
        })
    } catch (error) {
        console.log(error)
    }
})

/* POST Admin - Update a Post */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now(),
        })

        res.redirect(`/edit-post/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }
})

/* delete Admin - Delete a Post */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
    try {
        await Post.deleteOne({ _id: req.params.id })
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("token")
    //res.json({ message: 'Logout successful.'});
    res.redirect("/")
})

export default router
