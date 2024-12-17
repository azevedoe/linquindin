// const db = require("../database/connection");
// const path = require("node:path");

module.exports = {
	async getIndex(req, res) {
		res.render("dashboard", { layout: "painel.handlebars" });
	},	
};
