initializeBoard();
var pieces = {}, index = 0;
loadFen();

// if you press the right arrow key, go to the next fen
$(document).keydown(function (e) {
    if (e.keyCode === 39) {
        nextFen();
    }
});

// if you press the left arrow key, go to the previous fen
$(document).keydown(function (e) {
    if (e.keyCode === 37) {
        prevFen();
    }
});

function nextFen() {
    if (index < fenList.length - 1) {
        index++;
        loadFen();
    }
}

function prevFen() {
    if (index > 0) {
        index--;
        loadFen();
    }
}

function firstFen() {
    index = 0;
    loadFen();
}

function lastFen() {
    index = fenList.length - 1;
    loadFen();
}

// TODO aggiungi una tabella con le mosse 