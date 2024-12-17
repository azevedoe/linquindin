// const db = require("../database/connection");
// const path = require("node:path");

module.exports = {
	async getIndex(req, res) {
		res.render("projects", { title: "Projetos", active: 'projects', add: "/project/create", layout: "painel.handlebars" });
	},	
};
