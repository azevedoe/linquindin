const bcrypt = require("bcrypt");
const User = require("../models/user");
const createUpload = require('../utils/upload');
const Skill = require("../models/skill");
// const db = require("../database/connection");

async function resolveSkills(skills) {
	const resolvedSkill = [];

	for (const skill of skills) {
		let existingSkill = await Skill.findOne({ name: skill });

		if (!existingSkill) {
			existingSkill = new Skill({ name: skill });
			await existingSkill.save();
		}
		resolvedSkill.push(existingSkill._id);
	}
	return resolvedSkill;
}

module.exports = {
	async getSignup(req, res) {
		res.render("auth/sign-up", { layout: "main.handlebars" });
	},

	async getLogin(req, res) {
		res.render("auth/login", { layout: "main.handlebars" });
	},

	async getAll(req, res) {
		try {
			const users = await User.find().populate('skills', 'name');

			res.render("users/user-list", {
				title: "Usuários",
				active: "users",
				users,
				add: '/users/create',
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao buscar usuários.");
		}
	},

	async postLogin(req, res) {
		try {
			const { email, password } = req.body;

			const user = await User.findOne({ email });

			if (!user) {
				return res
					.status(401)
					.render("auth/login", { layout: 'main.handlebars', error: "E-mail ou senha incorretos." });
			}

			const passwordValida = await bcrypt.compare(password, user.password);
			if (!passwordValida) {
				return res
					.status(401)
					.render("auth/login", { layout: 'main.handlebars', error: "E-mail ou senha incorretos." });
			}

			req.session.userId = user._id;
			req.session.username = user.name;
			req.session.userEmail = user.email;
			req.session.type = user.type;
			req.session.avatar = user.avatar;

			if (user.type === "admin") {
				req.session.isAdmin = true;
			}

			res.redirect("/projects");
		} catch (error) {
			console.error("Erro no login:", error);
			res
				.status(500)
				.render("auth/login", {
					layout: "auth.handlebars",
					error: "Ocorreu um erro no servidor. Tente novamente.",
				});
		}
	},

	async getLogout(req, res) {
		req.session.destroy((err) => {
			if (err) {
				console.error("Erro ao encerrar sessão:", err);
			}
			res.redirect("/login");
		});
	},

	async postCreate(req, res) {
		try {
			const upload = createUpload();

			await new Promise((resolve, reject) => {
				upload(req, res, (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			});

			const { name, email, password, isAdmin, skills } = req.body;

			if (!password) {
				throw new Error('Password is required');
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			let avatarBase64 = null;
			if (req.file) {
				const imageBuffer = req.file.buffer;
				avatarBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
			}

			const parsedSkills = skills && skills !== "[]" ? JSON.parse(skills) : [];
			const keywordIds = await resolveSkills(parsedSkills);
			console.log(keywordIds)
			await User.create({
				name,
				email,
				password: hashedPassword,
				type: isAdmin ? 'admin' : 'aluno',
				avatar: avatarBase64,
				skills: keywordIds ?? []
			});

			if (req.url === "/sign-up") {
				res.redirect("/login");
			} else if (req.url === "/users/create") {
				res.redirect("/users");
			}

		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			res.status(500).send(`Erro ao criar usuário: ${error.message}`);
		}
	},

	async getCreateForm(req, res) {
		try {
			res.render("users/createUser", {
				title: "Criar usuário",
				active: "users",
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao carregar o formulário de criação.");
		}
	},

	async getEditForm(req, res) {
		try {
			const { id } = req.params;
			const user = await User.findById(id).populate('skills', 'name');

			const skills = user.skills.map((skill) => skill.name);

			res.render("users/editUser", {
				title: "Editar usuário",
				active: "users",
				user,
				skills,
				layout: "painel.handlebars",
			});
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao carregar o formulário de criação.");
		}
	},

	async postUpdate(req, res) {
		try {
			const upload = createUpload();

			await new Promise((resolve, reject) => {
				upload(req, res, (err) => {
					if (err) {
						reject(err);
					}
					resolve();
				});
			});

			const { id } = req.params;
			const { name, email, password, isAdmin, skills } = req.body;

			const parsedSkills = skills && skills !== "[]" ? JSON.parse(skills) : [];
			const keywordIds = await resolveSkills(parsedSkills);

			const user = {
				name,
				email,
				type: isAdmin ? 'admin' : 'aluno',
				skills: keywordIds ?? []
			}

			if (password) {
				const hashedPassword = await bcrypt.hash(password, 10);
				user.password = hashedPassword
			}

			let avatarBase64 = null;
			if (req.file) {
				const imageBuffer = req.file.buffer;
				avatarBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
				user.avatar = avatarBase64
			}

			const updatedUser = await User.findByIdAndUpdate(id, user, {
				new: true,
			});

			if (!updatedUser) {
				return res.status(404).send("Projeto não encontrado.");
			}


			if (req.url === "/sign-up") {
				res.redirect("/login");
			} else if (req.url === "/users/create") {
				res.redirect("/users");
			} else {
				res.redirect("/users");
			}

		} catch (error) {
			console.error("Erro ao criar usuário:", error);
			res.status(500).send(`Erro ao criar usuário: ${error.message}`);
		}
	},

	async deleteUser(req, res) {
		try {
			const { id } = req.params;
			const deletedUser = await User.findByIdAndDelete(id);

			if (!deletedUser) {
				return res.status(404).send("Usuário não encontrado.");
			}

			res.redirect("/users");
		} catch (err) {
			console.error(err);
			res.status(500).send("Erro ao deletar o usuário.");
		}
	},
};
