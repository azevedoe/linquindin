const mongoose = require("mongoose");
const Project = require("../models/project");
const User = require("../models/user");
const Keyword = require("../models/keyword");
const createUpload = require("../utils/upload"); // Importe a função de upload dinâmica
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
			const users = await User.find({}, ["name", "avatar"]).lean();
			console.log(users)
			res.render("projects/createProject", {
				title: "Criar Projeto",
				active: "projects",
				layout: "painel.handlebars",
				users,
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao carregar o formulário de criação.");
		}
	},

	async createProject(req, res) {
		try {
			const upload = createUpload();

			upload(req, res, async (err) => {
				if (err) {
					return res
						.status(400)
						.send(`Erro ao fazer upload da imagem: ${err.message}`);
				}

				const { title, subtitle, link, developers, keywords } = req.body;

				const parsedDevelopers =
					developers && developers !== "[]" ? JSON.parse(developers) : [];
				const parsedKeywords =
					keywords && keywords !== "[]" ? JSON.parse(keywords) : [];

				const keywordIds = await resolveKeywords(parsedKeywords);

				let photoBase64 = null;
				if (req.file) {
					const imageBuffer = req.file.buffer;
					photoBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
				}

				const newProject = new Project({
					title,
					subtitle,
					link,
					developers: parsedDevelopers,
					keywords: keywordIds,
					photo: photoBase64
				});

				await newProject.save();

				res.redirect("/projects");
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao criar o projeto.");
		}
	},

	async getProjectById(req, res) {
		try {
			const { id } = req.params;
			const project = await Project.findById(id)
				.populate("developers", ["name", "email", "avatar"])
				.populate("keywords", "name");

			if (!project) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.render("projects/projectDetail", {
				title: "Detalhes do Projeto",
				project,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar o projeto.");
		}
	},

	async getShowProjectById(req, res) {
		try {
			const { id } = req.params;
			const project = await Project.findById(id)
				.populate("developers", ["name", "email", "avatar"])
				.populate("keywords", "name");

			if (!project) {
				return res.status(404).send("Projeto não encontrado.");
			}

			res.render("projects/projectDetail", {
				title: "Detalhes do Projeto",
				project,
				layout: "main.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar o projeto.");
		}
	},

	async getEditForm(req, res) {
		try {
			const { id } = req.params;
			const users = await User.find({}, ["name", "avatar"]).lean();
			const project = await Project.findById(id)
				.populate("developers", "name avatar")
				.populate("keywords", "name");

			if (!project) {
				return res.status(404).send("Projeto não encontrado.");
			}

			const developers = project.developers.map((dev) => ({
				id: dev._id,
				name: dev.name,
				avatar: dev.avatar,
			}));

			const inputDevelopers = project.developers.map((dev) => {
				return dev._id;
			});

			const keywords = project.keywords.map((keyword) => keyword.name);

			res.render("projects/editProject", {
				title: "Editar Projeto",
				project,
				users,
				keywords,
				developers,
				inputDevelopers: inputDevelopers,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar o projeto para edição.");
		}
	},

	async updateProject(req, res) {
		try {
			const upload = createUpload("projects");

			await new Promise((resolve, reject) => {
				upload(req, res, (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			});

			console.log(req.body);

			const { id } = req.params;
			const { title, subtitle, link, developers, keywords } = req.body;

			console.log(title, subtitle, link, developers, keywords);

			let photoBase64 = null;
			if (req.file) {
				const imageBuffer = req.file.buffer;
				photoBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
			}

			const parsedDevelopers = developers && developers !== "[]" ? JSON.parse(developers) : [];

			const parsedKeywords =
				keywords && keywords !== "[]" ? JSON.parse(keywords) : [];

			const keywordIds = await resolveKeywords(parsedKeywords);

			const updateData = {
				title,
				subtitle,
				link,
				developers: parsedDevelopers,
				keywords: keywordIds,
			};

			if (req.file) {
				updateData.photo = photoBase64;
			}
			
			console.log(updateData)

			const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
				new: true,
			});

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
