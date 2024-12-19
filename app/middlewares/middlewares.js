module.exports = {
	logRegister(req, res, next) {
		console.log(req.url + req.method + new Date());
		next();
	},
	sessionControl(req, res, next) {
		if (req.session.userId) {
			res.locals.login = req.session.login;

			if (req.session.type === "admin") {
				res.locals.admin = true;
			}

			if (req.url === "/login" && req.method === "GET") {
				return res.redirect("/dashboard");
			}

			next();
		} else {
			if (req.url === "/login" || req.url === "/" || req.method === "POST") {
				return next();
			}

			if (req.url === "/sign-up" || req.url === "/" || req.method === "POST") {
				return next();
			}

			return res.redirect("/login");
		}
	},
};
