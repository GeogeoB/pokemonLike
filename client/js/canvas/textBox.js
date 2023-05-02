export default class TextBox {
    constructor(c, GameCanvas) {
        this.textBoxOpen = false;

        this.imageTextBox = new Image();
        this.imageTextBox.src = "./src/img/dialogue.png"; 

        this.c = c;
        this.GameCanvas = GameCanvas;
        this.height = 183;
        this.width = 982;
        this.lines = []
        this.actualFirstLine = 0
        this.numberOfLines = 5;

        this.text = "";
        this.wrap()
    }

    printText(text) {
        if(!this.textBoxOpen) {
            this.text = text;
            this.wrap()
            this.textBoxOpen = true;
        }
    }

    nextLine() {
        this.actualFirstLine++;

        if (this.actualFirstLine + this.numberOfLines > this.lines.length) {
            this.textBoxOpen = false;
            this.text = ""
            this.actualFirstLine = 0
        }
    }

    draw() {
        if(this.textBoxOpen) {
            this.c.drawImage(this.imageTextBox, this.GameCanvas.width / 2 - this.width/2, this.GameCanvas.height - this.height - 10);

            this.c.font = "15px pixelFont"; 
            this.c.textAlign = 'left'

            for (let i = this.actualFirstLine; i < this.lines.length && i < this.actualFirstLine + this.numberOfLines; i++) {
                this.c.fillText(this.lines[i], this.GameCanvas.width / 2 - this.width/2 + 60, this.GameCanvas.height - this.height + 41 + (i - this.actualFirstLine)*25);
            }
        }
    }

    wrap() {
        var lines = [];
        var words = this.text.split(' ');
        var actualLine = ""
        var testLine = ""
        
        for (let i = 0; i < words.length; i++) {
            
            const word = words[i];
            var testLine = actualLine + word + ' ';
            this.c.font = "15px pixelFont";
            var metrics = this.c.measureText(testLine);
            var testWidth = metrics.width;

            if (testWidth > this.width - 130 && i != words.length - 1) {
                lines.push(actualLine)
                testLine = ""
                actualLine = word + " "
            }
            else {
                actualLine = testLine;
            }
        }

        lines.push(actualLine)
        this.lines = lines;
        console.log("lines", lines)
    }
}