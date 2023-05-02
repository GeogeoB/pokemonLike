import * as object from "../object.js"
import Character from "./character.js";
import Player from "./player.js"
import TextBox from "./textBox.js"
import Menu from "./menu.js";
import Distributeur from "./promps/distributeur/distributeur.js";
import Arbuste from "./promps/arbuste/arbuste.js";
import Combat from "./combat.js";


export default class GameCanvas {
    constructor(socket) {
        object.pseudoBorder.remove()

        this.socket = socket;

        this.canvas = document.createElement('canvas');
        this.c = this.canvas.getContext("2d");
        this.canvas.id = 'canvas';
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width =  this.width;
        this.canvas.height = this.height;

        this.position_x = 0;
        this.position_y = 0;

        document.body.appendChild(this.canvas);

        this.SpriteAnimated = []
        this.promps = []
        this.MapMooveable = true;

        this.initCanvasWithProperties()
        this.initCharacterProperties()
        this.animate()
    }

    animate() {
        window.requestAnimationFrame(() => this.animate())

        this.c.fillStyle = "black";
        this.c.fillRect(0, 0, this.width, this.height)
        this.c.drawImage(this.image_room, this.position_x, this.position_y);

        this.SpriteAnimated.sort((a, b) => {
            let delta_a = a == this.player ? 0 : this.position_y;
            let delta_b = b == this.player ? 0 : this.position_y;
            return a.position_y + delta_a - b.position_y - delta_b;
        })

        this.SpriteAnimated.forEach(sprite => {
            if (this.MapMooveable) {
                if(sprite == this.player) {
                    sprite.draw(0, 0)
                } 
                else {
                    sprite.draw(this.position_x, this.position_y)
                }
            }
            else {
                sprite.draw(this.position_x, this.position_y)
            }
            
        });

        this.c.drawImage(this.image_foreground, this.position_x, this.position_y);

        this.menu.draw()
        this.textBox.draw()

        if(this.Combat.inFight) {
            this.Combat.draw()
        }
    }

    initCanvasWithProperties() {
        this.socket.emit("askRoomProperties", {})

        this.socket.on("getRoomProperties", (msg) => {
            this.room = msg["room"];

            this.initMap()
        })

        this.initMenu()
    }

    initMenu() {
        this.menu = new Menu(this.c, this);
    }

    initMap() {
        this.initMapRoom(this.room)
        this.initMapCollision(this.room)
        this.initMapOption(this.room)
        this.initMapAction(this.room)
        this.initMapHautesHerbes(this.room)
        this.CharacterGestion()
        this.initOtherCharacters()
        this.initPromps(this.room)
        this.initTextBox()
        this.initCombat()
    }

    initTextBox() {
        this.textBox = new TextBox(this.c, this)
    }

    initCombat() {
        this.Combat = new Combat(this.c, this);
    }

    initMapOption(room) {
        fetch("./src/img/room/" + room + "/roomOption.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
           
            this.MapMooveable = jsondata["MapMooveable"];
            console.log("MapMooveble", this.MapMooveable)
        });
    }

    MooveMap(delta_x, delta_y, player) {
        this.position_x -= delta_x;
        this.position_y -= delta_y;
    }

    initPromps(room) {
        fetch("./src/img/room/" + room + "/promps.json")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            
            if(jsondata["distributeur"]) {
                jsondata["distributeur"].forEach(element => {
                    var position_x = element[0];
                    var position_y = element[1];

                    var distributeur = new Distributeur(this.c, this, position_x, position_y)
                    this.SpriteAnimated.push(distributeur);
                    this.promps.push(distributeur);
                });
            }

            if(jsondata["arbuste"]) {
                jsondata["arbuste"].forEach(element => {
                    var position_x = element[0];
                    var position_y = element[1];

                    console.log("arbuste")

                    var arbuste = new Arbuste(this.c, this, position_x, position_y)
                    this.SpriteAnimated.push(arbuste);
                });
            }
        });
    }

    initMapRoom(room) {
        this.image_room = new Image();
        this.image_room.src = "./src/img/room/" + room + "/map.png";

        this.image_foreground = new Image();
        this.image_foreground.src = "./src/img/room/" + room + "/map_foreground.png";
    }

    initOtherCharacters() {
        this.socket.emit("OtherCharacters", {})
    }

    CharacterGestion() {
        this.socket.on("addNewCharacter", (msg) => {
            console.log("addNewCharacter");
            var carac = new Character(this.c, this, msg["pseudo"], msg["socket_id"], msg["position_x"], msg["position_y"]);
            this.SpriteAnimated.push(carac);
        })

        this.socket.on("characterDisconnect", (msg) => {
            this.SpriteAnimated = this.SpriteAnimated.filter((carac) => carac.socket_id != msg["socket_id"])
        })

        this.socket.on("updateMouvement", (msg) => {
            console.log(msg)
            for (let i = 0; i < this.SpriteAnimated.length; i++) {
                const charac = this.SpriteAnimated[i];
                if (charac.socket_id == msg.socket_id) {
                    charac.updatePosition(msg.position_x, msg.position_y);
                    break;
                }
            }
        })
    }

    initMapCollision(room) {
        this.image_MapCollision = new Image();
        this.image_MapCollision.src = "./src/img/room/" + room + "/map_collision.png";

        this.image_MapCollision.onload = () => {
            var canvas = document.createElement("canvas")
            canvas.width =  this.image_MapCollision.width;
            canvas.height = this.image_MapCollision.height;
            var context = canvas.getContext("2d");

            context.drawImage(this.image_MapCollision, 0, 0)
            context.getImageData(0, 0, this.image_MapCollision.width, this.image_MapCollision.height).data
            this.mapCollision = context.getImageData(0, 0, this.image_MapCollision.width, this.image_MapCollision.height, { colorSpace: "srgb" })
        }
    }

    initMapHautesHerbes(room) {
        this.image_HautesHerbes = new Image();
        this.image_HautesHerbes.src = "./src/img/room/" + room + "/mapHautesHerbes.png";

        this.image_HautesHerbes.onload = () => {
            var canvas = document.createElement("canvas")
            canvas.width =  this.image_HautesHerbes.width;
            canvas.height = this.image_HautesHerbes.height;
            var context = canvas.getContext("2d");

            context.drawImage(this.image_HautesHerbes, 0, 0)
            context.getImageData(0, 0, this.image_HautesHerbes.width, this.image_HautesHerbes.height).data
            this.mapHautesHerbes = context.getImageData(0, 0, this.image_HautesHerbes.width, this.image_HautesHerbes.height, { colorSpace: "srgb" })
        }
    }

    initMapAction(room) {
        
        this.image_MapAction = new Image();
        this.image_MapAction.src = "./src/img/room/" + room + "/map_action.png";
        
        this.image_MapAction.onload = () => {

            var canvas = document.createElement("canvas")
            canvas.width =  this.image_MapAction.width;
            canvas.height = this.image_MapAction.height;
            var context = canvas.getContext("2d");

            context.drawImage(this.image_MapAction, 0, 0);
            context.getImageData(0, 0, this.image_MapAction.width, this.image_MapAction.height).data

            this.mapAction = context.getImageData(0, 0, this.image_MapAction.width, this.image_MapAction.height, { colorSpace: "srgb" })
        }
    }

    initCharacterProperties() {
        this.socket.emit("askCharacterProperties", {})

        this.player = new Player(this.c, this);
        this.SpriteAnimated.push(this.player);
    }

    drawRoom(image_src) {
        //this.c.drawImage(this.image_MapCollision, 0, 0);
    }
}
