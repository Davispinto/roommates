const fs = require('fs');
const calculoDeGastos = () => {
    let roomatesJson = JSON.parse(fs.readFileSync('roommates.json', 'utf8'));
    let listadoRoommates = roomatesJson.roommates;
    let gastoJson = JSON.parse(fs.readFileSync('gastos.json', 'utf8'));
    let gastosLista = gastoJson.gastos;
    let divisor = listadoRoommates.length;

    listadoRoommates.forEach(miembro => {
        miembro.recibe = 0;
        miembro.debe = 0;
    });

    listadoRoommates.forEach(miembro => {
        gastosLista.forEach(gasto => {
            if (miembro.nombre == gasto.roommate) {
                miembro.recibe += parseInt(gasto.monto / divisor)
            } else {
                miembro.debe -= parseInt(gasto.monto / divisor)
            }
        });
    });
    fs.writeFileSync('roommates.json', JSON.stringify(roomatesJson));
}
module.exports = { calculoDeGastos };