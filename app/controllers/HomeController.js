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

			// Buscar todas as palavras-chave cadastradas no banco de dados
			const allKeywords = await Keyword.find().exec();

			// Filtro por título (nome do projeto)
			if (title) {
				filter.title = { $regex: title, $options: "i" };  // Filtro case-insensitive
			}

			// Filtro por múltiplas palavras-chave
			if (keywords) {
				// Verifica se keywords é um array ou uma string
				const keywordsArray = Array.isArray(keywords) ? keywords : [keywords];

				// Verifica se cada palavra-chave é válida
				const keywordRecords = await Keyword.find({
					_id: { $in: keywordsArray }  // Filtra com os IDs passados
				});

				if (keywordRecords.length > 0) {
					filter.keywords = { $in: keywordRecords.map(keyword => keyword._id) }; // Filtra com os IDs válidos
				} else {
					// Caso não encontre nenhuma palavra-chave válida, retorna uma lista vazia
					filter.keywords = { $in: [] };
				}
			}

			// Buscar projetos com base nos filtros aplicados
			const projects = await Project.find(filter).populate('keywords', 'name').exec();

			// Renderizar a página com os projetos filtrados
			res.render("projetos", {
				projects,
				keywords: allKeywords,  // Passar todas as palavras-chave para o template
				layout: "main.handlebars",
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

			// Filtro por nome
			if (name) {
				filter.name = { $regex: name, $options: "i" }; // Filtro case-insensitive
			}

			// Filtro por habilidades
			if (skills) {
				// Verifica se skills é um array
				const skillsArray = Array.isArray(skills) ? skills : [skills]; // Garante que skills seja um array

				// Buscar as habilidades no banco
				const skillRecords = await Skill.find({
					_id: { $in: skillsArray }  // Filtra as habilidades com os IDs passados
				});

				if (skillRecords.length > 0) {
					// Filtra os desenvolvedores que possuam as habilidades selecionadas
					filter.skills = { $in: skillRecords.map(skill => skill._id) };
				}
			}

			// Buscar desenvolvedores com base no filtro
			const users = await User.find(filter).populate('skills', 'name').exec();

			// Renderizar a página com os desenvolvedores filtrados
			res.render("desenvolvedores", {
				users,
				skills: await Skill.find().exec(), // Passar todas as habilidades para o template
				layout: "main.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar desenvolvedores.");
		}
	}
};
