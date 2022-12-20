const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const bearerToken = require("express-bearer-token")

// routers
const usersRouter = require("./routers/users");
const postsRouter = require("./routers/posts");
const commentsRouter = require("./routers/comments");
const likesRouter = require("./routers/likes")

// app.use
app.use(cors());
app.use(bearerToken())
app.use(express.json());
app.use("/public",express.static("public"));

app.get("/", (req, res) =>{
    res.send("access is secured!");
})

app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/comments", commentsRouter)
app.use("/likes", likesRouter)

app.use((error, req, res, next)=> {
    console.log({error});

    const errorFormat = {
        status: "Error",
        message: error.message,
        detail: error.detail,
        errorType: error?.errorType,
    };
    const httpCode = typeof error.code == "number" ? error.code : 500;
    res.status(httpCode).send(errorFormat);
});

app.listen(port, (error) => {
    if (error) return console.log({err: error.message});
    console.log(`api berhasil running di port ${port}`);
});