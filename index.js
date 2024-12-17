const database = require("./app/database/connection");
const mongoose = require('mongoose');

const routes = require("./app/routes/route");
const handlebars = require("express-handlebars");
const express = require("express");

const session = require("express-session");
const middlewares = require("./app/middlewares/middlewares");
const path = require("node:path");

const app = express();

mongoose.connect(database.connection).then(() => {
    console.log('conectado');
}).catch(() => {
    console.log('erro');
});

app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "tbTdafD9F-mFT5wPk487f&FKSAL;yy}n",
		cookie: { maxAge: 30 * 60 * 1000 },
		resave: false,
		saveUninitialized: false,
	}),
);

app.engine(
	"handlebars",
	handlebars.engine({
		defaultLayout: "main",
		layoutsDir: path.join(__dirname, "app", "views", "layouts"),
		partialsDir: path.join(__dirname, 'app', 'views', 'components'),
	}),
);

app.set("views", path.join(__dirname, "app", "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(middlewares.sessionControl);
app.use(routes);

app.use(
	express.urlencoded({
		extended: true,
	}),
);

app.listen(3000, () => {
	console.log("Servidor no http://localhost:3000");
});
