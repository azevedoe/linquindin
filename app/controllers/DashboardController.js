// const db = require("../database/connection");
// const path = require("node:path");

module.exports = {
	async getIndex(req, res) {
		res.render("dashboard", { title: "Dashboard", active: 'dashboard', layout: "painel.handlebars" });
	},	
};