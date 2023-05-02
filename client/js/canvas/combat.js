import Pokemon from "./pokemon.js";
import MenuCombat from "./menuCombat.js";

export default class Combat {
    constructor(c, gameCanvas) {
        this.c = c;
        this.gameCanvas = gameCanvas;

        this.combatWidth = Math.min(1000, this.gameCanvas.width);
        this.combatHeight = Math.min(600, this.gameCanvas.height);
        this.menuCombat = new MenuCombat(this.c, this.gameCanvas, this);

        this.inFight = false;

        this.reset()
    }

    launchFight(room, id_adversaire = 0) {
        this.reset()
        this.menuCombat.reset()
        
        this.myPokemonList = [
            {pokemon : "dracaufeu", name : "dracaufeu", HP: 0, maxHP : 300, level: 12, sexe : "M", 
            type: ["feu"],
            attack: [
                {name: "charge", degat: 100, pp: 10},
                {name: "Oui", degat: 100, pp: 10},
                {name: "charge", degat: 100, pp: 10},
            ]}
        ]

        this.initPokemons()

        this.room = room;
        this.id_adversaire = id_adversaire;

        this.initAdversaire(this.room, this.id_adversaire)
        this.inFight = true;
        this.menuCombat.printMenu = true;

        if (this.isLoose() || this.isWin()) {
            this.endFight()
        }
    }

    isLoose() {
        for (let i = 0; i < this.myPokemon.length; i++) {
            const pokemon = this.myPokemon[i];
            if (pokemon.HP > 0) {
                return true;
            }
        }

        return false;
    }

    isWin() {
        for (let i = 0; i < this.pokemonsAdverses.length; i++) {
            const pokemon = this.pokemonsAdverses[i];
            if (pokemon.HP > 0) {
                return false;
            }
        }

        return true;
    }

    endFight() {

    }

    reset() {
        this.inFight = false;
        this.myPokemonFighting = null;
        this.adversePokemonFighting = null;
        this.myPokemon = []
        this.pokemonsAdverses = []
        this.text = ""
        this.adversaire_name = "";        
    }

    up() {
        this.menuCombat.up()
    }

    down() {
        this.menuCombat.down()
    }

    initPokemons() {
        this.myPokemon = []
        for (let i = 0; i < this.myPokemonList.length; i++) {
            const pokemon = this.myPokemonList[i];
            this.myPokemon.push(new Pokemon(this.c, this.gameCanvas, pokemon.pokemon, pokemon.name, pokemon.HP, pokemon.maxHP, pokemon.level, pokemon.sexe, pokemon.type, pokemon.attack))
        }

        this.myPokemonFighting = this.myPokemon[0]
    }

    getPokemon() {

    }

    action() {
        this.menuCombat.action()
    }

    sendAction() {
        
    }

    initAdversaire(room, id_adversaire) {
        this.getPokemonAdverse(room, id_adversaire)

        if (id_adversaire > 0) {
            this.getAdversaireName(room, id_adversaire);
        }
    }

    getPokemonAdverse(room, id_adversaire) {
        this.gameCanvas.socket.emit("askPokemonAdverse", {room: room, id_adversaire: id_adversaire})

        this.gameCanvas.socket.on("getPokemonAdverse", (msg) => {
            this.pokemonsAdverses = []
            for (let i = 0; i < msg.pokemon.length; i++) {
                const pokemon = msg.pokemon[i];
                this.pokemonsAdverses.push(new Pokemon(this.c, this.gameCanvas, pokemon.pokemon, pokemon.name, pokemon.HP, pokemon.maxHP, pokemon.level, pokemon.sexe, pokemon.type, pokemon.attack))   
            }

            this.adversePokemonFighting = this.pokemonsAdverses[0]
        })
    }

    getAdversaireName(room, id_adversaire) {

    }

    draw() {
        this.c.fillStyle = "green";
        this.c.fillRect(this.gameCanvas.width / 2 - this.combatWidth / 2, 5, this.combatWidth, this.combatHeight)

        this.adversePokemonFighting.draw(1, this.gameCanvas.width / 2 - this.combatWidth / 2, 5)
        this.myPokemonFighting.draw(0, this.gameCanvas.width / 2 - this.combatWidth / 2, 5)
    

        this.menuCombat.draw()
    }    

}