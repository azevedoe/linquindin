const Keyword = require("../models/keyword");
const Project = require("../models/project");
const Skill = require("../models/skill");
const User = require("../models/user");

module.exports = {
	async getHome(req, res) {
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
	async getProjetos(req, res) {
		try {
			const { title, keywords } = req.query;

			const filter = {};

			const allKeywords = await Keyword.find().exec();

			if (title) {
				filter.title = { $regex: title, $options: "i" };
			}

			if (keywords) {
				const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];

				const keywordRecords = await Keyword.find({
					_id: { $in: keywordsArray }
				});

				if (keywordRecords.length > 0) {
					filter.keywords = { $in: keywordRecords.map(keyword => keyword._id) };
				} else {
					filter.keywords = { $in: [] };
				}
			}

			const projects = await Project.find(filter).populate('keywords', 'name').exec();

			res.render("projetos", {
				projects,
				keywords: allKeywords, layout: "main.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar projetos.");
		}
	},
	async getDesenvolvedores(req, res) {
		try {
			const { name, skills } = req.query;
			const filter = {};

			if (name) {
				filter.name = { $regex: name, $options: "i" };
			}

			if (skills) {
				const skillsArray = Array.isArray(skills) ? skills : [skills];
				const skillRecords = await Skill.find({
					_id: { $in: skillsArray }
				});

				if (skillRecords.length > 0) {
					filter.skills = { $in: skillRecords.map(skill => skill._id) };
				}
			}

			const users = await User.find(filter).populate('skills', 'name').exec();

			res.render("desenvolvedores", {
				users,
				skills: await Skill.find().exec(), layout: "main.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar desenvolvedores.");
		}
	}
};
