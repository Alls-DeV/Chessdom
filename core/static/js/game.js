initializeBoard();
var pieces = {}, index = 0;
$(text).text(String(index + 1) + " / " + String(fenList.length));
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
        $(text).text(String(index + 1) + " / " + String(fenList.length));
    }
}

function prevFen() {
    if (index > 0) {
        index--;
        loadFen();
        $(text).text(String(index + 1) + " / " + String(fenList.length));
    }
}

function firstFen() {
    index = 0;
    loadFen();
    $(text).text(String(index + 1) + " / " + String(fenList.length));
}

function lastFen() {
    index = fenList.length - 1;
    loadFen();
    $(text).text(String(index + 1) + " / " + String(fenList.length));
}

// TODO aggiungi una tabella con le mosse 