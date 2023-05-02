export default class Character {
    constructor(c, gameCanvas, name = null, socket_id = null, position_x = 500, position_y = 500) {
        this.c = c;
        this.gameCanvas = gameCanvas;
        this.name = name;
        this.socket_id = socket_id;

        this.position_x_rect = position_x;
        this.position_y_rect = position_y;

        this.size_x = 108;
        this.size_y = 156;

        this.position_x = position_x + this.size_x / 2;
        this.position_y = position_y + this.size_y;

        this.image = new Image();
        this.image.src = "../../src/img/character_animation.png";

        this.walk = 4; //0 : down, 1: right, 2: up, 3: left, 4: nothing
        this.frame = 0;
        this.elapse = 0;

        this.draw();
    }

    draw(delta_x, delta_y) {

        if (this.name != null) {
            this.c.font = "12px pixelFont";
            this.c.textAlign = 'center'
            this.c.fillText(this.name, this.position_x_rect + this.size_x / 2 + delta_x, this.position_y_rect + delta_y);
        }

        this.moove()

        this.c.drawImage(this.image,
            this.walk < 4 ? this.frame*108 + this.walk*3*108 : 0, 0,
            108, 156,
            this.position_x_rect + delta_x, this.position_y_rect + 3 + delta_y,  
            this.size_x , this.size_y);
        
        if (this.walk < 4) {
            if (this.elapse % 8 == 0) {
                this.frame += 1;
                if (this.frame >= 3) {
                    this.frame = 0;
                }
                this.elapse = 0;
            }
            this.elapse += 1;
        }

        this.reset_walk()

        //this.c.fillRect(this.hitboxRect.position_x, this.hitboxRect.position_y, this.hitboxRect.width, this.hitboxRect.height);
    }

    moove() {
        return null
    }

    reset_walk() {
        this.walk = 4;
    }
    

    updatePosition(position_x, position_y, player = false) {
        if (this.position_y_rect - position_y > 0) {
            this.walk = 2;
        } else if (this.position_y_rect - position_y < 0) {
            this.walk = 0;
        }

        if (this.position_x_rect - position_x > 0) {
            this.walk = 3;
        } else if (this.position_x_rect - position_x < 0) {
            this.walk = 1;
        }

        this.position_x_rect = position_x;
        this.position_y_rect = position_y;

        this.position_x = this.position_x_rect + this.size_x / 2;
        this.position_y = this.position_y_rect + this.size_y;
    }
}