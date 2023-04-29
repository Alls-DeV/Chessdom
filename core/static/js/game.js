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

function loadFen() {
    clearBoard();
    let fen = fenList[index];
    let rows = fen.split(" ")[0].split("/");
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];
        let j = 0;
        for (let k = 0; k < row.length; k++) {
            let c = row[k];
            if (c >= '1' && c <= '8') {
                j += parseInt(c);
            } else {
                pieces[String.fromCharCode(97 + j) + (8 - i)] = c;
                j++;
            }
        }
    }

    // Loop through the pieces array and add them to the chessboard
    for (let key in pieces) {
        if (pieces.hasOwnProperty(key)) {
            let piece = pieces[key];
            $("#" + key).html("<img src='/static/images/" + piece + ".png'>");
        }
    }

    if (checkList[index]) {
        let king_to_highlight = (index % 2 === 0) ? "K" : "k";
        let king_cell = null;
        for (let key in pieces) {
            if (pieces.hasOwnProperty(key) && pieces[key] === king_to_highlight) {
                king_cell = key;
                break;
            }
        }
        $("#" + king_cell).addClass("selected");
    } else {
        $(".cell").removeClass("selected");
    }
    document.getElementById("text").textContent = "   " + (index + 1) + "/" + fenList.length + "   ";
}

function clearBoard() {
    pieces = {};
    $(".cell").html("");
}