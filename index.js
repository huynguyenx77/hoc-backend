const express = require("express");
const path = require("path");
const methodsOverride = require("method-override");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");
const moment = require("moment");
require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const router = require("./routes/client/index.route");
const routerAdmin = require("./routes/admin/index.route");
// const { default: tinymce } = require("tinymce");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodsOverride("_method"));

//* parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

//*flash
app.use(cookieParser("khanh"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//*end flash

//* tinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
//* end tinyMCE

//* app locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

app.use(express.static(`${__dirname}/public`));

//*Router
routerAdmin(app);
router(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
