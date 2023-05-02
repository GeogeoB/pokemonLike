export default class Pokemon {
    constructor(c, gameCanvas, pokemon, name, HP, maxHP, level, sexe, type, attack) {
        this.c = c;
        this.gameCanvas = gameCanvas;
        this.pokemon = pokemon;
        this.name = name;
        this.HP = HP;
        this.maxHP = maxHP;
        this.level = level;
        this.sexe = sexe;
        this.type = type;
        this.attack = attack;
    }

    getAttaque() {
        return this.attack.map((item) => item.name);
    }

    draw(position, combat_x, combat_y) {
        this.c.fillStyle = "red";
        if (position == 0) {
            this.c.fillRect(combat_x + 100, combat_y + 200, 200 , 300)
        } else if (position == 1) {
            this.c.fillRect(combat_x + 700, combat_y + 50, 200 , 300)
        }
    }
}