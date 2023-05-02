const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var rooms_option = {};

function initialisation_rooms(io) {
  rooms_name = ["tuto", "test"]

  rooms_name.forEach(room_name => {
    rooms_option[room_name] = {}
    rooms_option[room_name]["option"] = {}
    rooms_option[room_name]["option"]["pokemon"] = [
      {pokemon : "dracaufeu", name : "dracaufeu", HP: 0, maxHP : 300, level: 12, sexe : "M"}
    ]
  })

  console.log(rooms_option)
}

app.use(express.static('client'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

initialisation_rooms()

io.on('connection', (socket) => {

  console.log('a user connected');
  socket.character = {}
  socket.character.bag = {}

  socket.on('setPseudo', (pseudo) => {

    var px = 500;
    var py = 500;

    socket.character.pseudo = pseudo;
    socket.character.room = "test";
    console.log('a new player connected, ', pseudo);

    io.to(socket.id).emit("creationCanvas", {})
    io.to(socket.character.room).emit("addNewCharacter", {pseudo: socket.character.pseudo, socket_id: socket.id, position_x: px, position_y: py}) 
    socket.join(socket.character.room);

    io.to(socket.character.room).option = !io.to(socket.character.room).option ? {option: "oui"} : io.to(socket.character.room).option[socket.id] = {
      pseudo: socket.character.pseudo,
      position_x: px,
      position_y: py,
    }

    rooms_option[socket.character.room][socket.id] = {pseudo: socket.character.pseudo, socket_id: socket.id, position_x: px, position_y: py}
  })

  socket.on("updateMouvement", (msg) => {
    socket.to(socket.character.room).emit("updateMouvement", msg)
    rooms_option[socket.character.room][msg.socket_id] = {pseudo: rooms_option[socket.character.room][msg.socket_id]["pseudo"], socket_id:  msg.socket_id, position_x: msg.position_x, position_y: msg.position_y}
  })

  socket.on('OtherCharacters', () => {
    Object.keys(rooms_option[socket.character.room]).forEach((id) => {
      character = rooms_option[socket.character.room][id]
      if (id != socket.id && id != "option") {
        io.to(socket.id).emit("addNewCharacter", {pseudo: character.pseudo, socket_id: character.socket_id, position_x: character.position_x, position_y: character.position_y}) 
      }
    })
  })

  socket.on("addItemInBag", (msg) => {
    item = msg["item"];
    nombre = msg["nombre"]

    console.log(item, nombre)
      
    if(socket.character.bag[item]) {
      socket.character.bag[item] += nombre;
    } else {
      socket.character.bag[item] = nombre;
    }

    if(socket.character.bag[item]  <= 0) {
      delete socket.character.bag[item];
    }

    console.log(socket.character.bag)
  })

  socket.on('askRoomProperties', () => {
    io.to(socket.id).emit("getRoomProperties", {room : socket.character.room})
  })

  socket.on('askBag', () => {
    io.to(socket.id).emit("getBag", socket.character.bag)
  })

  socket.on('askCharacterProperties', () => {
    io.to(socket.id).emit("getCharacterProperties", {name : socket.character.pseudo, socket_id : socket.id})
  })

  socket.on('askPokemonAdverse', (msg) => {
    let id_adversaire = msg.id_adversaire;
    let pokemon = [];

    if (id_adversaire == 0) {
      let arr = rooms_option[socket.character.room]["option"]["pokemon"];
      pokemon = arr[Math.floor(Math.random() * arr.length)];
      io.to(socket.id).emit("getPokemonAdverse", {pokemon : [pokemon]})
    }

    socket.character.adversaire = pokemon;
  })

  socket.on("disconnect", () => {
    console.log("deco ", socket.id)
    io.to(socket.character.room).emit("characterDisconnect", {socket_id: socket.id})
    
    if (socket.character.room && socket.id in rooms_option[socket.character.room]) {
      delete rooms_option[socket.character.room][socket.id]
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});