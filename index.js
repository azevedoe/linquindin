const database = require("./app/database/connection");
const mongoose = require("mongoose");
const { format } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");

const routes = require("./app/routes/route");
const handlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const express = require("express");

const session = require("express-session");
const middlewares = require("./app/middlewares/middlewares");
const path = require("node:path");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

mongoose.connect(database.connection)
	.then(() => {
		console.log("conectado");
	})
	.catch(() => {
		console.log("erro");
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
		partialsDir: path.join(__dirname, "app", "views", "components"),
		handlebars: allowInsecurePrototypeAccess(Handlebars),
		helpers: {
			eq: (a, b) => a === b,
			includes: (array, value, options) => {
				if (!Array.isArray(array)) return false;

				if (array.includes(value)) {
					return options.fn ? options.fn(this) : true;
				}

				return options.inverse ? options.inverse(this) : false; 
			},
			getInitials: (name) => {
				if (!name) return "";
				const parts = name.split(" ");
				const initials = parts.map((part) => part.charAt(0).toUpperCase());
				return initials.slice(0, 2).join("");
			},
			json: (context) => JSON.stringify(context, null, 2),
		},
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
