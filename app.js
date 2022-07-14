// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");



// https://www.npmjs.com/package/hbs
const hbs = require("hbs");
hbs.registerPartials(__dirname+"/views/partials")

const app = express();
//   // HBS partials


// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalized = require("./utils/capitalized");
const projectName = "World Exchangers";

app.locals.appTitle = `${capitalized(projectName)}`;

// 👇 Start handling routes here
const index = require("./routes/index.routes");
app.use("/", index);

const userRoutes = require("./routes/user.routes");
app.use("/user", userRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const countryRoutes = require("./routes/country.routes");
// const { collection } = require("./models/User.model");
app.use("/country", countryRoutes);

const orgRoutes = require("./routes/org.routes");
app.use("/org", orgRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);


module.exports = app;

