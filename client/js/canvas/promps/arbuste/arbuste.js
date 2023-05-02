export default class arbuste {
    constructor(c, GameCanvas, position_x, position_y) {
        this.position_x_rect = position_x;
        this.position_y_rect = position_y;

        this.GameCanvas = GameCanvas;

        this.c = c;

        this.image = new Image();
        this.image.src = "./../../../../src/img/promps/arbuste/arbuste.png";

        this.width = 102;
        this.height = 150;

        this.position_x = position_x + this.width/2;
        this.position_y = position_y + this.height - 14;
    }

    draw(delta_x, delta_y) {
        this.c.drawImage(this.image,
            0, 0,
            102, 150,
            this.position_x_rect + delta_x, this.position_y_rect + delta_y,
            this.width, this.height,
            );
        
        //this.c.fillRect(this.hitboxRect.position_x, this.hitboxRect.position_y, this.hitboxRect.width, this.hitboxRect.height);
    }

    action(player, c) {
    }
}