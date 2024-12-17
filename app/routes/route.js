const express = require('express');
const multer = require('multer');

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




route.get("/", homeController.getHome);


//Controller Usuario
route.get("/login", userController.getLogin);
route.post("/login", userController.postLogin);