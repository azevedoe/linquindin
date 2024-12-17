// const db = require("../database/connection");
// const path = require("node:path");

module.exports = {
	async getHome(req, res) {
		res.render("home", { layout: "main.handlebars" });
	},	
};
