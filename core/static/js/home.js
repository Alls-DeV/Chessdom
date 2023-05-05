initializeBoard();
var pieces = {}, index = 0, index_max = 0, startCellIdG = null, errors = 0, hints = 0, showingSolution = false;
loadFen();
document.getElementById("errors_icon").textContent = errors;
document.getElementById("hints_icon").textContent = hints;
document.getElementById("result").value = 0;

// Add a click event listener to each cell on the chessboard
$(".cell").click(function () {
    // Get the ID of the clicked cell
    let cellId = $(this).attr("id");
    if (index == index_max) {
        // If a piece is already selected
        if (startCellIdG !== null) {
            if (startCellIdG === cellId) {
                // If the same piece is clicked, deselect the piece
                $(this).removeClass("selected");
                startCellIdG = null;
                return;
            }

            movePiece(cellId);
            if (getFen().split(" ")[0] !== fenList[index + 1].split(" ")[0]) {
                document.getElementById("errors_icon").textContent = ++errors;
                document.getElementById("text").textContent = "That's not the move! Try something else"
                document.getElementById("text").style.color = "red";
                if (hints === 0 && errors === 1) {
                    document.getElementById("delta_elo").textContent = "-" + String(delta_elo);
                    document.getElementById("delta_elo").style.color = "red";
                }
                document.getElementById("result").value = -1;
                showingSolution = true;
                setTimeout(function () { loadFen(); }, 1000);
                showingSolution = false;
            } else {
                index_max = Math.max(index_max, ++index);
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
                if (index_max === fenList.length - 1) {
                    index_max++;
                    if (hints + errors === 0) {
                        document.getElementById("text").textContent = "You win!"
                        document.getElementById("text").style.color = "green";
                        document.getElementById("delta_elo").textContent = "+" + String(delta_elo);
                        document.getElementById("delta_elo").style.color = "green";
                        document.getElementById("result").value = 1;
                    } else {
                        document.getElementById("text").textContent = "Puzzle complete!"
                        document.getElementById("text").style.color = defaultColor;
                    }
                    $('#hintButton').prop('disabled', true).blur();
                } else {
                    index_max = Math.max(index_max, ++index);
                    showingSolution = true;
                    setTimeout(function () { loadFen(); }, 1000);
                    showingSolution = false;
                    document.getElementById("text").textContent = "Best move! Keep going…"
                    document.getElementById("text").style.color = "green";
                }
            }
        }
        // If no piece is selected, select the clicked piece (if there is one)
        else {
            if (getPiece(cellId) !== null) {
                startCellIdG = cellId;
                // Add the selected class to the cell
                $(this).addClass("selected");
            }
        }
    }
});

$(document).keydown(function (e) {
    if (!showingSolution) {
        if (e.keyCode === 39) {
            nextFen();
        }
        else if (e.keyCode === 37) {
            prevFen();
        }
        else if (e.keyCode === 27) {
            $("#" + startCellIdG).removeClass("selected");
            startCellIdG = null;
        }
    }
});

function nextFen() {
    if (index < index_max && index < fenList.length - 1) {
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

function hint() {
    showingSolution = true;

    index_max = Math.max(index_max, ++index);
    loadFen();
    if (index_max === fenList.length - 1) {
        index_max++;
        document.getElementById("text").textContent = "Puzzle complete!"
        $('#hintButton').prop('disabled', true).blur();
    } else {
        index_max = Math.max(index_max, ++index);
        setTimeout(function () { loadFen(); }, 1000);
    }

    showingSolution = false;
    document.getElementById("hints_icon").textContent = ++hints;
}
