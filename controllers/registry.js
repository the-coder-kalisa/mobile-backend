const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const joi = require('joi');
let secret = "thecoder";
const User = require('../models/registry');

exports.permision = async (req, res) => {
    try {
        console.log(req.params.token);
    } catch (error) {

    }
}
exports.signup = async (req, res) => {
    try {
        let error = await validate(req.body, 'signup');
        if (error) return res.status(400).send(error);
        let hashed = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashed;
        let user = await User.create(req.body);
        let token = jwt.sign({ _id: user._id }, secret);
        res.status(201).send(token);
    } catch (error) {
        console.log(error)
        res.status(500).send('internal server error');
    }
}
exports.login = async (req, res) => {
    try {
        let error = await (validate(req.body, 'login'));
        let user = await User.findOne({ email: req.body.email });
        if (error) return res.status(400).send(error);
        let token = jwt.sign({ _id: user._id }, secret);
        res.status(200).send(token);
    } catch (error) {
        res.status(500).send("internal server error")
    }
}
const validate = async (data, mode) => {
    if (mode === "login") {
        data.name = undefined;
    };
    let { email, name } = data;
    let { error } = schema.validate(data);
    error = error?.details[0]?.message;
    let user = await User.findOne({ email })
    if (mode === "login" && (error === "\"name\" is required")) {
        let isValid = user && bcrypt.compare(data.password, user?.password);
        if (!isValid) return "Invalid password or email";
        return undefined;
    }
    if (user) return "email already exists";
    user = await User.findOne({ name });
    if (user) return "name already exists";
    if (error) return error;
}
const schema = joi.object().keys({
    name: joi.string().min(5).max(15).required(),
    email: joi.string().lowercase().email().required(),
    password: joi.string().required()
});
