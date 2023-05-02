import Icon from "./iconPokemon.js";

export default class MenuPokemon {
    constructor(c, GameCanvas, actionnable = true) {
        this.pokemonList = [
            {pokemon : "dracaufeu", name : "dracaufeu", HP: 0, maxHP : 300, level: 12, sexe : "M", 
            type: ["feu"],
            attack: [
                {name: "charge", degat: 100, pp: 10},
                {name: "Oui", degat: 100, pp: 10},
            ]},

            {pokemon : "dracaufeu", name : "dracaufeu", HP: 0, maxHP : 300, level: 12, sexe : "M", 
            type: ["feu"],
            attack: [
                {name: "charge", degat: 100, pp: 10},
                {name: "Oui", degat: 100, pp: 10},
            ]},

            {pokemon : "dracaufeu", name : "dracaufeu", HP: 0, maxHP : 300, level: 12, sexe : "M", 
            type: ["feu"],
            attack: [
                {name: "charge", degat: 100, pp: 10},
                {name: "Oui", degat: 100, pp: 10},
            ]},            
                        ]

        this.printMenuPokemon = true;

        this.ItemMenuPokemon = new Image();
        this.ItemMenuPokemon.src = "../../src/img/ItemMenuPokemon.png";

        this.width = 300;
        this.height = 60;

        this.c = c;
        this.GameCanvas = GameCanvas;

        this.icons = []
        this.createIcons()
        this.opened = false;

        this.actionnable = actionnable;

        this.actualPokemon = 0;
        this.actualFirstPokemon = 0;
        this.selectedPokemon = -1;

        this.tailleMaxMenu = 10;
    }

    getPokemon() {

    }

    reset() {
        this.opened = false;
        this.actualPokemon = 0;
        this.selectedPokemon = -1;
        this.actualFirstPokemon = 0;
    }

    createIcons() {
        this.icons = []
        for (let i = 0; i < this.pokemonList.length; i++) {
            const pokemon = this.pokemonList[i];
            this.icons.push(new Icon(this.c, this.GameCanvas, pokemon.pokemon, this.GameCanvas.width - this.width - 10, i*(this.height + 5) + 100))
        }
    }

    updateIcon() {
        for (let i = 0; i < this.icons.length; i++) {
            const icon = this.icons[i];
            icon.position_y = (i - this.actualFirstPokemon)*(this.height + 5) + 100;
        }
    }

    down() {
        this.actualPokemon = this.actualPokemon + 1

        if (this.actualPokemon >= this.actualFirstPokemon + this.tailleMaxMenu) {
            this.actualFirstPokemon++;
        }

        if (this.actualPokemon >= this.pokemonList.length) {
            this.actualFirstPokemon = 0;
            this.actualPokemon = 0;
        }
    }

    up() {
        this.actualPokemon = (this.actualPokemon - 1) % (this.pokemonList.length + 1)

            if (this.actualPokemon < this.actualFirstPokemon) {
                if (this.actualFirstPokemon - 1 < 0) {
                    this.actualFirstPokemon = this.pokemonList.length > this.tailleMaxMenu ? this.pokemonList.length - this.tailleMaxMenu : 0
                    this.actualPokemon = this.pokemonList.length - 1
                } else {
                    this.actualFirstPokemon = this.actualFirstPokemon - 1;
                }
            } 
    }
    
    action() {
        if (this.actionnable) {
            if(this.selectedPokemon >= 0) {
                let mem = this.pokemonList[this.actualPokemon]
                this.pokemonList[this.actualPokemon] = this.pokemonList[this.selectedPokemon];
                this.pokemonList[this.selectedPokemon] = mem;
                this.selectedPokemon = -1;
                this.createIcons();
            } else {
                this.selectedPokemon = this.actualPokemon;
            }
        }
    }

    draw() {
        if(this.printMenuPokemon) {
            
            for (let i = this.actualFirstPokemon; i < this.pokemonList.length && (i - this.actualFirstPokemon) <this.tailleMaxMenu; i++) {
                const pokemon = this.pokemonList[i];
                const icon = this.icons[i];

                this.c.fillStyle = "yellow";
                if (pokemon.HP  <= 0) {
                    this.c.fillStyle = "gray";
                }
                this.c.fillRect(this.GameCanvas.width - this.width + 190, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 10, 100, 30)
                
                this.c.fillStyle = "green";
                this.c.fillRect(this.GameCanvas.width - this.width + 190 + 100 - pokemon.HP*100/pokemon.maxHP, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 10, pokemon.HP*100/pokemon.maxHP, 30)
                this.c.fillStyle = "black";

                this.c.drawImage(this.ItemMenuPokemon, 
                    this.GameCanvas.width - this.width, (i - this.actualFirstPokemon)*(this.height + 5) + 100,
                    this.width, this.height);
                

                //name
                this.c.font = "10px pixelFont"; 
                this.c.textAlign = 'left'
                this.c.fillText(pokemon.name, this.GameCanvas.width - this.width + 55, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 30);
                this.c.strokeText(pokemon.name, this.GameCanvas.width - this.width + 55, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 30);

                //level
                this.c.textAlign = 'right'
                this.c.fillText("Lv ", this.GameCanvas.width - this.width + 100, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 50);
                this.c.strokeText("Lv ", this.GameCanvas.width - this.width + 100, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 50);
                this.c.textAlign = 'left'
                this.c.fillText(pokemon.level, this.GameCanvas.width - this.width + 100, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 50);
                this.c.strokeText(pokemon.level, this.GameCanvas.width - this.width + 100, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 50);

                //HP
                this.c.textAlign = 'right'
                this.c.fillText(pokemon.HP, this.GameCanvas.width - this.width + 230, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);
                this.c.strokeText(pokemon.HP, this.GameCanvas.width - this.width + 230, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);
                
                this.c.textAlign = 'left'
                this.c.fillText("/", this.GameCanvas.width - this.width + 231, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);
                this.c.strokeText("/", this.GameCanvas.width - this.width + 231, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);

                this.c.fillText(pokemon.maxHP, this.GameCanvas.width - this.width + 240, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);
                this.c.strokeText(pokemon.maxHP, this.GameCanvas.width - this.width + 240, (i - this.actualFirstPokemon)*(this.height + 5) + 100 + 55);

                //cursor
                if(i == this.actualPokemon || i == this.selectedPokemon) {
                    this.c.fillStyle = "black";
                    this.c.font = "80px pixelFont";
                    this.c.fillText(".", this.GameCanvas.width - this.width - 38, (i - this.actualFirstPokemon)*(this.height + 5) + 138);
                    this.c.font = "50px pixelFont";
                    this.c.fillStyle = "white";
                    this.c.fillText(".", this.GameCanvas.width - this.width - 35, (i - this.actualFirstPokemon)*(this.height + 5) + 135);
                    this.c.fillStyle = "black";
                }
                
                this.updateIcon()
                icon.draw();
            }
        }
    }
}