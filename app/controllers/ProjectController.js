const Project = require("../models/project");
const User = require("../models/user");
const Keyword = require("../models/keyword");

module.exports = {
	async getIndex(req, res) {
		try {
			const projects = await Project.find()
				.populate("developers", "name email")
				.populate("keywords", "name");

			res.render("projects", {
				title: "Projetos",
				active: "projects",
				projects,
				add: "/project/create",
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar projetos.");
		}
	},

	async getCreateForm(req, res) {
		try {
			const developers = await User.find({}, ["name", "avatar"]).lean(); 
			const keywords = await Keyword.find({}, "name").lean(); 
			
			res.render("projects/createProject", {
				title: "Criar Projeto",
				active: 'projects',
				layout: "painel.handlebars",
				developers, 
				keywords, 
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao carregar o formulário de criação.");
		}
	},

	async createProject(req, res) {
		try {
			const { title, subtitle, link, developers, keywords } = req.body;

			const newProject = new Project({
				title,
				subtitle,
				link,
				developers: developers
					? Array.isArray(developers)
						? developers
						: [developers]
					: [],
				keywords: keywords
					? Array.isArray(keywords)
						? keywords
						: [keywords]
					: [],
			});

			await newProject.save();
			res.redirect("/projects");
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao criar o projeto.");
		}
	},

	async getProjectById(req, res) {
		try {
			const { id } = req.params;
			const project = await Project.findById(id)
				.populate("developers", "name email")
				.populate("keywords", "name");

			if (!project) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.render("projectDetail", {
				title: "Detalhes do Projeto",
				project,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar o projeto.");
		}
	},

	async getEditForm(req, res) {
		try {
			const { id } = req.params;
			const project = await Project.findById(id);

			if (!project) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.render("editProject", {
				title: "Editar Projeto",
				project,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar o projeto para edição.");
		}
	},

	async updateProject(req, res) {
		try {
			const { id } = req.params;
			const { title, subtitle, link, developers, keywords } = req.body;

			const updatedProject = await Project.findByIdAndUpdate(
				id,
				{
					title,
					subtitle,
					link,
					developers: developers ? developers.split(",") : [],
					keywords: keywords ? keywords.split(",") : [],
				},
				{ new: true },
			);

			if (!updatedProject) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.redirect("/projects");
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao atualizar o projeto.");
		}
	},

	async deleteProject(req, res) {
		try {
			const { id } = req.params;

			const deletedProject = await Project.findByIdAndDelete(id);

			if (!deletedProject) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.redirect("/projects");
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao deletar o projeto.");
		}
	},
};
