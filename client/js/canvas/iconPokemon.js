export default class MenuPokemon {
    constructor(c, GameCanvas, pokemon, position_x, position_y) {
        this.c = c;
        this.GameCanvas = GameCanvas;
        this.pokemon = pokemon;
        this.position_x = position_x;
        this.position_y = position_y;

        if (pokemon != "Retour") {
            this.imageIcon = new Image();
            this.imageIcon.src = "../../src/img/icon/" + pokemon + ".png"
    
            this.dataPokemon = {
                "dracaufeu" : {width : 89, height: 91, maxFrame: 143, delta_y: -25},
                "tortank" : {width : 69, height: 65, maxFrame: 244, delta_y: 0}
            }
    
            this.frame = Math.floor(Math.random() * this.dataPokemon[pokemon].maxFrame);
            this.elapse = 0;
    
            this.maxFrame = this.dataPokemon[pokemon].maxFrame;
            this.width = this.dataPokemon[pokemon].width;
            this.height = this.dataPokemon[pokemon].height;
            this.delta_y = this.dataPokemon[pokemon].delta_y;
        }

    }

    draw() {
        if (this.pokemon != "Retour") {
            this.c.drawImage(this.imageIcon,
                this.frame*this.width, 0,
                this.width, this.height,
                this.position_x - 5, this.position_y + this.delta_y ,
                this.width, this.height
                );
    
            if (this.elapse % 3 == 0) {
                this.frame = (this.frame + 1) % this.maxFrame 
                this.elapse = 0;
            }
            this.elapse++;
        }
    }
}