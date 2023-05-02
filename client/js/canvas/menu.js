import MenuPokemon from "./menuPokemon.js";

export default class Menu {
    constructor(c, GameCanvas) {
        this.MenuImage = new Image();
        this.MenuImage.src = "../../src/img/menu_selection.png";
        this.printMenu = false;

        this.c = c;
        this.GameCanvas = GameCanvas;
        this.width = 200;
        this.height = 200;

        this.previousMenu = "MenuSelection"
        this.actualMenu = "MenuSelection"
        this.actualFirstItem = 0;

        this.bagItemSelected = null;
        

        this.menuItem = {
            "MenuSelection" : ["Pokédex","Pokemon","Bag","Map","Retour"],
            "BagItem" : ["Utiliser", "Jeter", "Retour"],
            "Bag" : [],
        }
            
        this.menuHeightMax = this.GameCanvas.height;
        this.tailleMaxMenu = Math.round((this.menuHeightMax - 60) / 40)

        this.menuPokemon = new MenuPokemon(this.c, this.GameCanvas);
        this.menuPokedex = new MenuPokemon(this.c, this.GameCanvas, false);
        

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
        this.actualMenu = "MenuSelection";
        this.previousMenu = "MenuSelection";
        this.actualFirstItem = 0;
        this.actualItem = 0;
        this.bagItemSelected = null;
        this.printMenu = !this.printMenu;
        this.menuPokemon.opened = false;
        this.menuPokemon.reset()
        this.menuPokedex.reset()
    }
    
    action() {
        if (this.actualMenu == "MenuSelection") {
            if(this.menuItem[this.actualMenu][this.actualItem] == "Pokédex") {
                this.menuPokedex.getPokemon()
                this.menuPokedex.opened = true;
                this.previousMenu = "MenuSelection";
                this.actualMenu = "Pokédex";
            } else if(this.menuItem[this.actualMenu][this.actualItem] == "Pokemon") {
                this.menuPokemon.getPokemon()
                this.menuPokemon.opened = true;
                this.previousMenu = "MenuSelection";
                this.actualMenu = "Pokemon";
            } else if(this.menuItem[this.actualMenu][this.actualItem] == "Bag") {

                this.getBag()

                this.previousMenu = "MenuSelection";
                this.actualMenu = "Bag";
            } else if (this.menuItem[this.actualMenu][this.actualItem] == "Retour") {
                this.reset();
            }
        } else if (this.actualMenu == "MenuPokedex") {
            null
        } else if (this.actualMenu == "Bag") {
            if (this.menuItem[this.actualMenu][this.actualItem] == "Retour") {
                this.previousMenu = "MenuSelection";
                this.actualMenu = "MenuSelection";
            } else {
                this.bagItemSelected = this.menuItem["Bag"][this.actualItem]
    
                this.menuItem["BagItem"] = [this.bagItemSelected, "Utiliser", "Jeter", "Retour"]
    
                this.previousMenu = "Bag";
                this.actualMenu = "BagItem";
            }
        } 
        else if (this.actualMenu == "BagItem") {
            if (this.menuItem[this.actualMenu][this.actualItem] == "Utiliser") {
                this.GameCanvas.textBox.printText("Cela ne fait rien (pour l'instant)")
            } else if (this.menuItem[this.actualMenu][this.actualItem] == "Jeter") {
                this.GameCanvas.socket.emit("addItemInBag", {item : this.bagItemSelected.split(" ")[0], nombre: -1})
                this.getBag()
                this.previousMenu = "MenuSelection";
                this.actualMenu = "Bag";
            } else if (this.menuItem[this.actualMenu][this.actualItem] == "Retour") {
                this.getBag()
                this.previousMenu = "MenuSelection";
                this.actualMenu = "Bag";
            }
        } else if (this.actualMenu == "Pokemon") {
            this.menuPokemon.action();
        } else if (this.actualMenu == "Pokédex") {
            this.menuPokedex.action()
        }

        this.actualItem = 0
    }

    draw() {
        if(this.printMenu) {
            if(this.menuPokemon.opened) {
                this.menuPokemon.draw()
            } else if (this.menuPokedex.opened) {
                this.menuPokedex.draw()
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