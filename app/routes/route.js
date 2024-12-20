const express = require('express');
const multer = require('multer');

const projectController = require('../controllers/ProjectController');
const callerProjectController = require('../controllers/CallerProjectController');
const dashboardController = require('../controllers/DashboardController');
const homeController = require('../controllers/HomeController');
const userController = require('../controllers/UserController');
const route = express.Router();

module.exports = route;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,  "public/uploads/");
    },
    filename: (req, file, cb) => {
        req.imageName = `${req.body.nome}.png`
        cb(null, req.imageName)
    },
})
const upload = multer({ storage: storage });

route.get("/", callerProjectController.getIndex);

// Rotas de Login
route.get("/sign-up", userController.getSignup);
route.post("/sign-up", userController.postCreate);
route.get("/login", userController.getLogin);
route.post("/login", userController.postLogin);
route.get("/logout", userController.getLogout);

// Cadastro de usuário 
route.post("/create", userController.postCreate);
route.get("/users", userController.getAll);
route.get("/logout", userController.getLogout);
route.get("/users/create", userController.getCreateForm);
route.post("/users/create", userController.postCreate);
route.post("/users/:id/delete", userController.deleteUser);

route.get("/dashboard", dashboardController.getIndex);

route.get("/projects", projectController.getIndex);
route.get("/project/create", projectController.getCreateForm);
route.post("/project/create", projectController.createProject);
route.get("/project/:id", projectController.getProjectById);
route.get("/project/:id/edit", projectController.getEditForm);
route.post("/project/:id/edit", projectController.updateProject);
route.post("/project/:id/delete", projectController.deleteProject);