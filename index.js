const http = require("http");
const fs = require("fs");
const url = require("url");
const moment = require("moment");
const { v4: uuidv4 } = require("uuid");
const { nuevoUsuario, guardarUsuario, guardarGastos } = require("./usuarios");
const { calculoDeGastos } = require("./calculoDeGastos.js");

const server = http.createServer((req, res) => {
    const gastosJSON = JSON.parse(fs.readFileSync("gastos.json", "UTF8"));
    const arregloGastos = gastosJSON.gastos;
    if (req.url == "/" && req.method == "GET") {
      res.setHeader("content-type", "text/html");
      res.end(fs.readFileSync("index.html", "UTF8"));
    }
    if (req.url.startsWith("/roommate") && req.method == "POST") {
      nuevoUsuario()
        .then(async (usuario) => {
          guardarUsuario(usuario);
          res.end(JSON.stringify(usuario));
        })
        .catch((e) => {
          res.statusCode = 500;
          res.end();
          console.log("error en el registro usuario ramdon");
        });
    };

    if (req.url.startsWith("/roommates") && req.method == "GET") {
      res.setHeader("Content-type", "aplication/json");
      res.end(fs.readFileSync("roommates.json", "UTF8"));
    };

    if (req.url.startsWith("/gastos") && req.method == "GET") {
      res.setHeader("Content-type", "aplication/json");
      res.end(fs.readFileSync("gastos.json", "UTF8"));
    };

    if (req.url.startsWith("/gasto") && req.method == "POST") {
      let body;
      req.on("data", (playload) => {
        body = JSON.parse(playload);
      });
      req.on("end", () => {
        let gastoNuevo = {
          roommate: body.roommate,
          descripcion: body.descripcion,
          monto: body.monto,
          fecha: moment().format("MMMM Do YY, hh:mm:ss a"),
          id: uuidv4().slice(30),
        };
        guardarGastos(gastoNuevo);
        calculoDeGastos();
        res.end();
      });
    };

    if (req.url.startsWith("/gasto") && req.method == "PUT") {
      let body;
      const { id } = url.parse(req.url, true).query;
      req.on("data", (playload) => {
        body = JSON.parse(playload);
      });

      req.on("end", () => {
        gastosJSON.gastos = arregloGastos.map((b) => {
          if (b.id == id) {
            const update = {
              roommate: body.roommate,
              descripcion: body.descripcion,
              monto: body.monto,
              fecha: moment().format("LLL"),
              id: b.id,
            };
            return update;
          }
          return b;
        });
        fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
        calculoDeGastos();
        res.end();
      });
    };

    if (req.url.startsWith("/gasto") && req.method == "DELETE") {
      const { id } = url.parse(req.url, true).query;
      gastosJSON.gastos = arregloGastos.filter((g) => {
        return g.id !== id
      });
      fs.writeFileSync("gastos.json", JSON.stringify(gastosJSON));
      calculoDeGastos();
      res.end();
    }
  })
  .listen(3000, console.log("Servidor 3000 activo"));
  module.exports = {server};