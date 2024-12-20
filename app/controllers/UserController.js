const bcrypt = require("bcrypt");
const User = require("../models/user");
const createUpload = require('../utils/upload');
// const db = require("../database/connection");

module.exports = {
	async getSignup(req, res) {
		res.render("auth/sign-up", { layout: "auth.handlebars" });
	},

	async getLogin(req, res) {
		res.render("auth/login", { layout: "auth.handlebars" });
	},

	async getAll(req, res) {
		try {
			const users = await User.find();

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
					.render("auth/login", { layout: 'auth.handlebars', error: "E-mail ou senha incorretos." });
			}

			const passwordValida = await bcrypt.compare(password, user.password);
			if (!passwordValida) {
				return res
					.status(401)
					.render("auth/login", { layout: 'auth.handlebars', error: "E-mail ou senha incorretos." });
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

			await User.create({
				name,
				email,
				password: hashedPassword,
				type: isAdmin ? 'admin' : 'aluno',
				avatar: avatarBase64, 
				skills: []
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
