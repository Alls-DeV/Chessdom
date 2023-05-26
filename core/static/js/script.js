document.documentElement.style.setProperty('--white-color', white_color);
document.documentElement.style.setProperty('--black-color', black_color);

function initializeBoard() {
    // Loop through all the div in the chessboard
    $(".my-container div").each(function (index, value) {
        // Get the ID of the cell
        let cellId = $(this).attr("id");
        if (cellId !== undefined && cellId.length === 2) {
            $(this).addClass("cell");
            // id is like "a7" or "b7". a = 0, b = 1, c = 2, etc. add the first character to the second digit to get the number of the cell
            let cellNumber = cellId.charCodeAt(0) - 97 + parseInt(cellId[1]);
            if (cellNumber % 2 === 1) {
                $(this).addClass("black");
            }
        }
    });

}

function getFen() {
    let fen = "";
    for (let i = 8; i >= 1; i--) {
        let empty = 0;
        for (let j = 0; j < 8; j++) {
            let key = String.fromCharCode(97 + j) + i;
            if (pieces.hasOwnProperty(key)) {
                if (empty > 0) {
                    fen += empty;
                    empty = 0;
                }
                fen += pieces[key];
            } else {
                empty++;
            }
        }
        if (empty > 0) {
            fen += empty;
        }
        if (i > 1) {
            fen += "/";
        }
    }
    return fen;
}

// Function to get the piece in a cell (if there is one)
function getPiece(cellId) {
    if (cellId[1] !== "0" && cellId[1] !== "9")
        return pieces.hasOwnProperty(cellId) ? pieces[cellId] : null;
    return extra.hasOwnProperty(cellId) ? extra[cellId] : null;
}

function movePiece(endCellId) {
    // Get the piece that is in the starting cell
    var piece = getPiece(startCellIdG);

    if (piece === "trash") {
        if (endCellId[1] !== "0" && endCellId[1] !== "9") {
            $("#" + endCellId).html("");
            // Remove the piece from the pieces array
            delete pieces[endCellId];
        } else {
            $("#" + startCellIdG).removeClass("selected");
            startCellIdG = endCellId;
            $("#" + startCellIdG).addClass("selected");
        }
    } else {
        let startCell = $("#" + startCellIdG);
        startCell.removeClass("selected");

        // If the piece isn't in the row 0 or 9, remove the piece from the current cell
        if (startCellIdG[1] !== "0" && startCellIdG[1] !== "9" &&
            endCellId[1] !== "0" && endCellId[1] !== "9") {
            startCell.html("");
            // Remove the piece from the pieces array
            delete pieces[startCellIdG];
        }

        if (endCellId[1] !== "0" && endCellId[1] !== "9") {
            let endCell = $("#" + endCellId);
            endCell.html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
            pieces[endCellId] = piece;
            startCellIdG = null;
        } else {
            startCellIdG = endCellId;
            $("#" + startCellIdG).addClass("selected");
        }
    }
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
            $("#" + key).html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
        }
    }

    $(".cell").removeClass("checked");
    if (checkList[index]) {
        let king_to_highlight;

        if (fenList[0].split(" ")[1] === "w") {
            king_to_highlight = (index % 2 === 0) ? "K" : "k";
        } else {
            king_to_highlight = (index % 2 === 0) ? "k" : "K";
        }
        let king_cell = null;
        for (let key in pieces) {
            if (pieces.hasOwnProperty(key) && pieces[key] === king_to_highlight) {
                king_cell = key;
                break;
            }
        }
        $("#" + king_cell).addClass("checked");
    }
}

function clearBoard() {
    pieces = {};
    $(".cell").html("");
}