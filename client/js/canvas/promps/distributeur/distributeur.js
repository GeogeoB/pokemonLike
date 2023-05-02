export default class distributeur {
    constructor(c, GameCanvas, position_x, position_y) {
        this.position_x_rect = position_x;
        this.position_y_rect = position_y;

        this.GameCanvas = GameCanvas;

        this.c = c;

        this.image = new Image();
        this.image.src = "./../../../../src/img/promps/distributeur/distributeur.png";

        this.frame = Math.floor(Math.random() * 2);
        this.elapse = 0

        this.width = 124;
        this.height = 226;

        this.position_x = position_x + this.width/2;
        this.position_y = position_y + this.height - 14;
    }

    draw(delta_x, delta_y) {
        this.c.drawImage(this.image,
            this.frame*124, 0,
            124, 226,
            this.position_x_rect + delta_x, this.position_y_rect + delta_y,
            this.width, this.height,
            );
        
        if (this.elapse % 8 == 0) {
            this.frame += 1;
            if (this.frame >= 2) {
                this.frame = 0;
            }
            this.elapse = 0;
        }
        this.elapse += 1;
        
        //this.c.fillRect(this.hitboxRect.position_x, this.hitboxRect.position_y, this.hitboxRect.width, this.hitboxRect.height);
    }

    action(player, c) {
        this.GameCanvas.socket.emit("addItemInBag", {item: "canette", nombre:  1})
        this.GameCanvas.textBox.printText("Vous avez reçu une canette !")
    }
}