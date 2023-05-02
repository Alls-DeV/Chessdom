initializeBoard();

var pieces = {
    "a0": "P",
    "b0": "N",
    "c0": "B",
    "d0": "R",
    "e0": "Q",
    "f0": "K",
};

// Loop through the pieces array and add them to the chessboard
for (let key in pieces) {
    if (pieces.hasOwnProperty(key)) {
        let piece = pieces[key];
        $("#" + key).html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
    }
}

function changeSample() {
    $(".cell").html("");

    piece_set = $("#piece_set").val();
    white_color = $("#white-color-picker").val();
    black_color = $("#black-color-picker").val();

    document.documentElement.style.setProperty('--white-color', white_color);
    document.documentElement.style.setProperty('--black-color', black_color);

    // Loop through the pieces array and add them to the chessboard
    for (let key in pieces) {
        if (pieces.hasOwnProperty(key)) {
            let piece = pieces[key];
            $("#" + key).html("<img src='/static/images/piece_set/" + piece_set + "/" + piece + ".png'>");
        }
    }
}