import MenuPokemon from "./menuPokemonCombat.js";

export default class Menu {
    constructor(c, GameCanvas, Combat) {
        this.MenuImage = new Image();
        this.MenuImage.src = "../../src/img/menu_selection.png";
        this.printMenu = false;

        this.c = c;
        this.GameCanvas = GameCanvas;
        this.width = 200;
        this.height = 200;

        this.previousMenu = "MenuCombat"
        this.actualMenu = "MenuCombat"
        this.actualFirstItem = 0;

        this.bagItemSelected = null;
        this.Combat = Combat;
        

        this.menuItem = {
            "MenuCombat" : ["Attaque","Bag","Pokemon","Fuite"],
            "Attaque": [],
        }
            
        this.menuHeightMax = this.GameCanvas.height;
        this.tailleMaxMenu = Math.round((this.menuHeightMax - 60) / 40)

        this.menuPokemon = new MenuPokemon(this.c, this.GameCanvas, this);
        
        this.actualItem = 0
    }

    down() {
        if (this.actualMenu == "Pokemon") {
            this.menuPokemon.down()
        } else if (this.actualMenu == "Pokédex") {
            this.menuPokedex.down()
        } else {
            this.actualItem = this.actualItem + 1
    
            if (this.actualItem >= this.actualFirstItem + this.tailleMaxMenu) {
                this.actualFirstItem++;
            }
    
            if (this.actualItem >= this.menuItem[this.actualMenu].length) {
                this.actualFirstItem = 0;
                this.actualItem = 0;
            }
        }
    }

    up() {
        if (this.actualMenu == "Pokemon") {
            this.menuPokemon.up()
        } else if (this.actualMenu == "Pokédex") {
            this.menuPokedex.up()
        } else {
            this.actualItem = (this.actualItem - 1) % (this.menuItem[this.actualMenu].length + 1)

            if (this.actualItem < this.actualFirstItem) {
                if (this.actualFirstItem - 1 < 0) {
                    this.actualFirstItem = this.menuItem[this.actualMenu].length > this.tailleMaxMenu ? this.menuItem[this.actualMenu].length - this.tailleMaxMenu : 0
                    this.actualItem = this.menuItem[this.actualMenu].length - 1
                } else {
                    this.actualFirstItem = this.actualFirstItem - 1;
                }
            }     
        } 
    }

    getBag() {
        this.GameCanvas.socket.emit("askBag", {})

        this.GameCanvas.socket.on("getBag", (msg) => {
            this.menuItem["Bag"] = []
            Object.keys(msg).forEach((item) => {
                var nombre = msg[item]
                this.menuItem["Bag"].push(item + " " + nombre)
            })

            this.menuItem["Bag"].push("Retour");
        })
    }

    reset() {
        this.actualMenu = "MenuCombat";
        this.previousMenu = "MenuCombat";
        this.actualFirstItem = 0;
        this.actualItem = 0;
        this.bagItemSelected = null;
        this.printMenu = !this.printMenu;
        this.menuPokemon.opened = false;
        this.menuPokemon.reset()
    }
    
    action() {
        if (this.actualMenu == "MenuCombat") {
            if(this.menuItem[this.actualMenu][this.actualItem] == "Attaque") {
                this.menuItem.Attaque = this.Combat.myPokemonFighting.getAttaque();
                this.menuItem.Attaque.push("Retour")
                this.previousMenu = "MenuCombat";
                this.actualMenu = "Attaque";
            } else if (this.menuItem[this.actualMenu][this.actualItem] == "Pokemon") {
                this.menuPokemon.getPokemon()
                this.menuPokemon.opened = true;
                this.previousMenu = "MenuSelection";
                this.actualMenu = "Pokemon";
            } else if (this.menuItem[this.actualMenu][this.actualItem] == "Fuite") {
                this.Combat.inFight = false;
                this.Combat.reset()
            }
        }
        else if (this.actualMenu == "Attaque") {
            if (this.menuItem[this.actualMenu][this.actualItem] == "Retour") {
                this.previousMenu = "MenuCombat";
                this.actualMenu = "MenuCombat";
            } else {
                
            }
        } else if(this.actualMenu == "Pokemon") {
            this.menuPokemon.action();
        }

        this.actualItem = 0
    }

    draw() {
        this.c.fillStyle = "black";
        if(this.printMenu) {
            if(this.menuPokemon.opened) {
                this.menuPokemon.draw()
            } else {
                this.c.drawImage(this.MenuImage, 
                    this.GameCanvas.width - this.width, 0,
                    this.width, this.menuItem[this.actualMenu].length*40 + 40 < this.menuHeightMax ? this.menuItem[this.actualMenu].length*40 + 40 : this.menuHeightMax);
        
                this.c.font = "15px pixelFont"; 
                this.c.textAlign = 'left'
                
                for (let i = this.actualFirstItem; i < this.menuItem[this.actualMenu].length && (i - this.actualFirstItem) <this.tailleMaxMenu; i++) {
                    if(i == this.actualItem) {
                        this.c.font = "50px pixelFont";
                        this.c.fillText(".", this.GameCanvas.width - this.width + 30, (i - this.actualFirstItem)*40 + 46);
                    }
                    this.c.font = "15px pixelFont";
                    this.c.fillText(this.menuItem[this.actualMenu][i], this.GameCanvas.width - this.width + 50, (i - this.actualFirstItem)*40 + 50);
                }
            } 
        }
    }
}