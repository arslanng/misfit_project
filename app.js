const express = require("express");
const pageRouter = require("./routes/pageRouter");
const courseRouter = require("./routes/courseRouter");
const categoryRouter = require("./routes/categoryRouter");
const userRouter = require("./routes/userRouter");
const mongoose = require("mongoose");
var session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const app = express();

mongoose
  .connect("mongodb://localhost/misfit-project")
  .then(() => console.log("DB connected"));

global.userIN = null;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard_cat_rambo",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost/misfit-project",
    }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRouter);
app.use("/courses", courseRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);

port = 3000;
app.listen(port, () => {
  console.log(`Uygulama port ${port} üzerinden başlatıldı`);
});
