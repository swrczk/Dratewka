// trochę lepsze niż niejawne arguments[n]
// w sumie podczas inicjalizacji items nie musi być tablicą...
function _localization(title, color, directions, items) {
    //można by pomyśleć nad domyślnymi wartościami
    this.locTitle = title || 'Dummy title';
    this.locColor = color;
    this.directions = directions; // N-8, E-4, S-2, W-1
    this.locItem = items;

    this.isNorth = function () {
        return (this.directions & 8);
    }

    this.isEast = function () {
        return (this.directions & 4);
    }

    this.isSouth = function () {
        return (this.directions & 2);
    }

    this.isWest = function () {
        return (this.directions & 1);
    }

    this.changePlace = function (consoleArg) {
        let isOpenPath = false
        let specialCase = false

        consoleArg = engine.nameOfDirection(consoleArg)
        switch (consoleArg) {
            case "NORTH":
                if (this.isNorth()) {
                    player.instance -= 10
                    isOpenPath = true
                }
                break;

            case "SOUTH":
                if (this.isSouth()) {
                    player.instance += 10
                    isOpenPath = true
                }
                break;

            case "EAST":
                if (this.isEast()) {
                    player.instance += 1
                    isOpenPath = true
                }
                break;

            case "WEST":
                if (this.isWest()) {
                    if (player.instance === 42 && player.dragon === 0) {
                        specialCase = true
                        engine.gameDescription = "You can't go that way... "
                        $("#commandResponse").html(engine.gameDescription)
                        $("#gameConsole").hide()
                        setTimeout(function () {
                            engine.gameDescription = " The dragon sleeps in a cave!"
                            // setTimeout(function () {
                            engine.displayAction()
                            // }, ACTION_TIME)
                        }, ACTION_TIME)
                    } else {
                        player.instance -= 1
                        isOpenPath = true
                    }
                }
                break
        }
        if (isOpenPath) {
            engine.gameDescription = "You are going " + consoleArg.toLowerCase() + "..."
            engine.loadData()
        } else if (!specialCase)
            engine.gameDescription = "You can't go that way"
    }
}

//zostawiam dla ciebie ;)
function _reaction() {
    this.needed = arguments[0]
    this.location = arguments[1]
    this.result = arguments[2]
    this.message = arguments[3]
    this.specialMark = arguments[4]
}

function _items() {
    this.fullName = arguments[0]
    this.name = arguments[1]

    this.canLift = function () {
        return this.name[0] === this.name[0].toUpperCase()
    }
}

// function $(name){
//     let type = name[0]
//     switch(type){
//         case "#":
//             return document.getElementById(name.substring(1))
//         case ".":
//             return document.getElementsByClassName(name.substring(1))
//     }
// }
