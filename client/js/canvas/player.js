import Character from "./character.js";

export default class Player extends Character {
    constructor(c, gameCanvas) {
        super(c, gameCanvas)

        gameCanvas.socket.on("getCharacterProperties", (msg) => {
            this.name = msg["name"];
            this.socket_id = msg["socket_id"];
        })

        this.constante = {
            hitbox_shift_x: 25,
            hitbox_shift_y: 20,
            delta_move: 12,
            probaHautesHerbes: 1/80,
        }

        this.key_pressed = {
            z: false,
            q: false,
            s: false,
            d: false,
        }

        this.action = false;

        this.imageButtonA = new Image();
        this.imageButtonA.src = "../../src/img/buttons/buttonA.png";
        

        this.hitboxRect = {
            position_x: this.position_x_rect + this.constante.hitbox_shift_x,
            position_y: this.position_y_rect + this.size_y - this.constante.hitbox_shift_y,
            width: 50,
            height: this.constante.hitbox_shift_y,
        }

        this.last_key = ""

        this.initListener();
    }

    updateHitboxRect() {
        this.hitboxRect.position_x = this.position_x_rect + this.constante.hitbox_shift_x;
        this.hitboxRect.position_y = this.position_y_rect + this.size_y - this.constante.hitbox_shift_y;
    }

    isCollisionWithCollisionMap(x, y, w, h) {
        var collision_map = this.gameCanvas.mapCollision;
        //console.log(collision_map.data[y * (collision_map.width * 4) + x * 4])

        for (let i = x; i <= x+w; i++) {
            for (let j = y; j <= y+h; j++) {
                if (collision_map.data[i * 4 + j * (collision_map.width * 4)] > 0) {
                    return true;
                }
            }
        }
        
        return false;
    }

    isOnHautesHerbes(x, y, w, h) {
        var hautesHerbes_Map = this.gameCanvas.mapHautesHerbes;
        //console.log(collision_map.data[y * (collision_map.width * 4) + x * 4])

        for (let i = x; i <= x+w; i++) {
            for (let j = y; j <= y+h; j++) {
                if (hautesHerbes_Map.data[i * 4 + j * (hautesHerbes_Map.width * 4)] > 0) {
                    return true;
                }
            }
        }
        
        return false;
    }

    isOnMapAction(x, y, w, h) {
        var action_map = this.gameCanvas.mapAction;
        //console.log(collision_map.data[y * (collision_map.width * 4) + x * 4])
        if (action_map) {
            for (let i = x; i <= x+w; i++) {
                for (let j = y; j <= y+h; j++) {
                    if (action_map.data[i * 4 + j * (action_map.width * 4)] > 0) {
                        this.action = true;
                        return true;
                    }
                }
            }
        }
        
        this.action = false;
        return false;
    }

    MAJserverPosition() {
        this.gameCanvas.socket.emit("updateMouvement", {socket_id: this.socket_id, position_x: this.position_x_rect - this.gameCanvas.position_x, position_y: this.position_y_rect - this.gameCanvas.position_y})
    }

    reset_walk() {
        return null;
    }

    initListener() {
        window.addEventListener(('keyup'), (e) => {
            var key = e.key;

            if(key == "z") {
                this.key_pressed.z = false;
            }

            if(key == "q") {
                this.key_pressed.q = false;
            }

            if(key == "s") {
                this.key_pressed.s = false;
            }

            if(key == "d") {
                this.key_pressed.d = false;
            }
            
            if (key == "z" || key == "d" || key == "s" || key == "q") {
                if(!this.key_pressed.z && !this.key_pressed.q && !this.key_pressed.s && !this.key_pressed.d) {
                    this.walk = 4;
                }
            }
        })

        window.addEventListener('keydown', (e) => {
            var key = e.key;
            var isMenu = this.gameCanvas.menu.printMenu
            var menu = this.gameCanvas.menu;
            var isCombat = this.gameCanvas.Combat.inFight;

            if (key == "z") {
                if (isCombat) {
                    this.gameCanvas.Combat.up()
                }
                else if (isMenu) {
                    menu.up()
                }
                else {
                    this.walk = 2;
                    this.key_pressed.z = true;
                }
            }
            else if (key == "d") {
                if (isCombat) {
                }
                else if(!isMenu) {
                    this.walk = 1;
                    this.key_pressed.d = true;
                }
            }
            else if(key == "s") {
                if (isCombat) {
                    this.gameCanvas.Combat.down()
                }
                else if (isMenu) {
                    menu.down()
                }
                else {
                    this.walk = 0;
                    this.key_pressed.s = true;
                }
            } 
            else if (key =="q") {
                if (isCombat) {
                }
                else if(!isMenu) {
                    this.walk = 3;
                    this.key_pressed.q = true;
                }
            }
            else if (key == "a") {
                if (isCombat) {
                    this.gameCanvas.Combat.action()
                }
                else if(isMenu) {
                    menu.action()
                } else {
                    this.makeAction()
                }
            }
            else if(key == "e") {
                if (isCombat) {

                } else {
                    menu.reset()
                }
            }
            else {
                this.last_key = "";
            }           
        })
    }

    makeAction() {
        if (this.gameCanvas.textBox.textBoxOpen) {
            this.gameCanvas.textBox.nextLine()
        }
        else if (this.action) {
            var promps = this.gameCanvas.promps;

            for (let i = 0; i < promps.length; i++) {
                const promp = promps[i];
                
                if(Math.pow((promp.position_x - this.position_x + this.gameCanvas.position_x), 2) + Math.pow((promp.position_y - this.position_y + this.gameCanvas.position_y), 2) < 10000) {
                    promp.action(this, this.gameCanvas)
                }
            }
        }
        
    }

    draw(delta_x, delta_y) {
        super.draw(delta_x, delta_y)

        if(this.hitboxRect) {
            var isAction = this.isOnMapAction(
                this.hitboxRect.position_x - this.gameCanvas.position_x,
                this.hitboxRect.position_y - this.gameCanvas.position_y,
                this.hitboxRect.width,
                this.hitboxRect.height)
    
            if(isAction && this.imageButtonA) {
                this.c.drawImage(this.imageButtonA, 
                    this.position_x_rect + this.size_x / 2 - 20, this.position_y_rect - 60,
                    40, 40);
            }
        }
        
    }

    hautesHerbes() {
        var isHautesHerbes = this.isOnHautesHerbes(
            this.hitboxRect.position_x - this.gameCanvas.position_x,
            this.hitboxRect.position_y - this.gameCanvas.position_y,
            this.hitboxRect.width,
            this.hitboxRect.height)

        if(isHautesHerbes) {
            if (Math.random() <= this.constante.probaHautesHerbes) {
                this.gameCanvas.Combat.launchFight(this.room)
            }
        }
    }

    moove() {
        if (this.walk < 4) {
            var delta_x = 0;
            var delta_y = 0;

            if (this.walk == 2) {
                delta_y -= this.constante.delta_move;
            } 
            else if(this.walk == 1) {
                delta_x += this.constante.delta_move;
            } 
            else if (this.walk == 0) {
                delta_y += this.constante.delta_move;
            }
            else if (this.walk == 3){
                delta_x -= this.constante.delta_move;
            }

            var isCollision = this.isCollisionWithCollisionMap(
                this.hitboxRect.position_x + delta_x - this.gameCanvas.position_x,
                this.hitboxRect.position_y + delta_y - this.gameCanvas.position_y,
                this.hitboxRect.width,
                this.hitboxRect.height)


            if (!isCollision) {
                
                if (!this.gameCanvas.Combat.inFight) {
                    this.MAJserverPosition(this.position_x_rect + delta_x, this.position_y_rect + delta_y)
    
                    if (this.gameCanvas.MapMooveable) {
                        this.gameCanvas.MooveMap(delta_x, delta_y, this)
                    } else {
                        this.updatePosition(this.position_x_rect + delta_x, this.position_y_rect + delta_y, true)
                    }
                    
                    this.updateHitboxRect()
                    
                    //HautesHerbes
                    this.hautesHerbes()
                }
                

            }
        }
         
    }
}