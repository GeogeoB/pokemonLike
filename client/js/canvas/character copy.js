export default class Character {
    constructor(c, gameCanvas) {
        this.c = c;

        gameCanvas.socket.on("getCharacterProperties", (msg) => {
            this.name = msg["name"];
            this.socket_id = msg["socket_id"];
        })

        this.gameCanvas = gameCanvas;

        this.position_x = 500;
        this.position_y = 500;
        this.size_x = 100;
        this.size_y = 100;

        this.constante = {
            hitbox_shift_x: 25,
            hitbox_shift_y: 20,
            delta_move: 4,
        }

        this.hitboxRect = {
            position_x: this.position_x + this.constante.hitbox_shift_x,
            position_y: this.position_y + this.size_y - this.constante.hitbox_shift_y,
            width: 50,
            height: this.constante.hitbox_shift_y,
        }

        this.initListener();

        this.image = new Image();
        this.image.src = "../../src/img/logo_character.png";

        this.draw();
    }

    updateHitboxRect() {
        this.hitboxRect.position_x = this.position_x + this.constante.hitbox_shift_x;
        this.hitboxRect.position_y = this.position_y + this.size_y - this.constante.hitbox_shift_y;
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

    initListener() {
        window.addEventListener('keydown', (e) => {
            var key = e.key;
            var delta_x = 0;
            var delta_y = 0;

            if (key == "z") {
                delta_y -= this.constante.delta_move;
            }
            else if (key == "d") {
                delta_x += this.constante.delta_move;
            }
            else if(key == "s") {
                delta_y += this.constante.delta_move;
            } 
            else if (key =="q") {
                delta_x -= this.constante.delta_move;
            }
            
            var isCollision = this.isCollisionWithCollisionMap(
                this.hitboxRect.position_x + delta_x,
                this.hitboxRect.position_y + delta_y,
                this.hitboxRect.width,
                this.hitboxRect.height)

            if (!isCollision) {
                this.position_x += delta_x;
                this.position_y += delta_y;
                this.updateHitboxRect()
            }            
        })
    }

    draw() {
        this.c.font = "12px pixelFont";
        this.c.textAlign = 'center'
        this.c.fillText(this.name, this.position_x + this.size_x / 2, this.position_y);
        this.c.drawImage(this.image, this.position_x, this.position_y + 3, this.size_x, this.size_y);
        //this.c.fillRect(this.hitboxRect.position_x, this.hitboxRect.position_y, this.hitboxRect.width, this.hitboxRect.height);
    }
}