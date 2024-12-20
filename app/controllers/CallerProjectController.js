const Project = require("../models/project");
const User = require("../models/user");
const Keyword = require("../models/keyword");
const createUpload = require('../utils/upload');  // Importe a função de upload dinâmica
const { format } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");

async function resolveKeywords(keywords) {
	const resolvedKeywords = [];

	for (const keyword of keywords) {
		let existingKeyword = await Keyword.findOne({ name: keyword });

		if (!existingKeyword) {
			existingKeyword = new Keyword({ name: keyword });
			await existingKeyword.save();
		}
		resolvedKeywords.push(existingKeyword._id);
	}
	return resolvedKeywords;
}

module.exports = {
	async getIndex(req, res) {
		try {
			const projects = await Project.find().populate("keywords", "name");
			const users = await User.find({});

			res.render("home", {
				title: "Projetos",
				active: "projects",
				projects,
				users,
				layout: "main.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar projetos.");
		}
	},
};
