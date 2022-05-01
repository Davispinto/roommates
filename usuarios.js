const axios = require("axios");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const { calculoDeGastos } = require("./calculoDeGastos")

const nuevoUsuario = async () => {
    try {
        const { data } = await axios.get("https://randomuser.me/api")
        const usuario = data.results[0]
        const user = {
            id: uuidv4().slice(30),
            correo: usuario.email,
            nombre: `${usuario.name.first} ${usuario.name.last}`,
            debe: 0,
            recibe: 0,
            total: 0
        };
        return user;
    } catch (e) {
        throw e;
    }
};

const guardarUsuario = (usuario) => {
    const usuarioJSON = JSON.parse(fs.readFileSync('roommates.json', "UTF8"))
    usuarioJSON.roommates.push(usuario)
    fs.writeFileSync("roommates.json", JSON.stringify(usuarioJSON))
    calculoDeGastos();
};

const guardarGastos = (prueba) => {
    const gastosJSON = JSON.parse(fs.readFileSync('gastos.json', "UTF8"))
    gastosJSON.gastos.push(prueba)
    fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
};
module.exports = { nuevoUsuario, guardarUsuario, guardarGastos };