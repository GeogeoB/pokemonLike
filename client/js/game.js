import GameCanvas from "./canvas/gameCanvas.js";
import * as object from "./object.js"

var socket = io();

object.submitButton.addEventListener('click', (e) => {
    e.preventDefault()

    if (object.pseudoInput.value != "") {
        object.pseudoInput.disabled = "true";
        socket.emit('setPseudo', object.pseudoInput.value)
    }

})

socket.on("creationCanvas", () => {
    var gc = new GameCanvas(socket)
})
