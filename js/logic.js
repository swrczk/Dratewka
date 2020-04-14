var logic = {
    column: 3,
    row: 6,
    equipment: 0,
    gameDescription: "",
    collectedStones: 0,
    skin: 0,
    dragon: 0,
    text: "",
    action: function () {

        $("#commandResponse").html(logic.gameDescription)
        $("#gameConsole").hide()

        setTimeout(function () {
            $("#commandResponse").html("What's now?")
            $("#gameConsole").show()
            $("#gameConsole").focus()
        }, ACTION_TIME);
    },
    loadData: function () {
        setTimeout(function () {

            setCompassDefault()

            let currentLoc = places[logic.column][logic.row]

            setCurrentLocImg(currentLoc)

            let locDescription = ""

            if (currentLoc.isNorth()) {
                locDescription += " north"
                $("#compassN").hide()
            }
            if (currentLoc.isEast()) {
                if (locDescription.trim()) {
                    locDescription += ","
                }
                locDescription += " east"
                $("#compassE").hide()
            }
            if (currentLoc.isSouth()) {
                if (locDescription.trim()) {
                    locDescription += ","
                }
                locDescription += " south"
                $("#compassS").hide()
            }
            if (currentLoc.isWest()) {
                if (locDescription.trim()) {
                    locDescription += ","
                }
                locDescription += " west"
                $("#compassW").hide()
            }
            locDescription = "You can go:" + locDescription

            let availableItems = 0;
            for (let i = 0; i < currentLoc.locItem.length; i++) {
                if (currentLoc.locItem[i] != 0) {
                    availableItems++
                }
            }
            let availableItemsNames = "";
            if (availableItems == 0) {
                availableItemsNames = "You see nothing"
            } else {
                for (let i = 0; i < currentLoc.locItem.length; i++) {
                    if (currentLoc.locItem[i] != 0) {

                        if (availableItemsNames.trim()) {
                            availableItemsNames += ","
                        }
                        availableItemsNames += " " + items[currentLoc.locItem[i] - ITEM_SHIFT].fullName
                    }
                }

                availableItemsNames = "You see " + availableItemsNames
            }

            let carrying;
            if (logic.equipment == 0)
                carrying = "You are carrying nothing"
            else {
                carrying = "You are carrying " + items[logic.equipment - ITEM_SHIFT].fullName
            }

            $("#gameText").html(locDescription + ". <br><br>" + availableItemsNames + ". <br><br>" + carrying + ". ")
        }, ACTION_TIME)
    },
    startGame: function () {
        gameConsole.onkeydown = function (e) {


            let currentLoc = places[logic.column][logic.row]
            let keyDownNumber = e.which
            let command = 0;
            let item = 0;

            if (pressedEnter(keyDownNumber) || isUp(keyDownNumber) || isDown(keyDownNumber) || isLeft(keyDownNumber) || isRight(keyDownNumber)) {
                let consoleArg = $("#gameConsole").val().toUpperCase().trim()

                if (!consoleArg.includes(" ")) {
                    consoleArg = whichDirection(consoleArg, keyDownNumber)
                } else {
                    command = consoleArg.split(" ")

                    consoleArg = whichAction(command[0])
                    do {
                        item++
                        if (item == items.length) {
                            logic.gameDescription = "This item doesn't exist"
                            logic.action()
                            break;
                        }
                    } while (command[1] != items[item].name)

                }

                let gameText = document.getElementById("gameText")
                let commandResponse = document.getElementById("commandResponse")
                let itemID;

                switch (consoleArg) {
                    case "V" :
                    case "G": //info || lore
                        logic.text = $("#gameText").text()
                        if (consoleArg == "V") $("#gameText").html(INSTRUCTION)
                        else $("#gameText").html(LORE_INFO)
                        $("#gameConsole").hide()
                        $("#commandResponse").hide()
                        putPrevText()
                        break;

                    case "N":
                        if (currentLoc.isNorth()) {
                            logic.column--
                            logic.gameDescription = "You are going north..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "S":
                        if (currentLoc.south == 1) {
                            logic.column++
                            logic.gameDescription = "You are going south..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "E":
                        if (currentLoc.isEast()) {

                            logic.gameDescription = "You are going east..."
                            logic.row++
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "W":
                        if (currentLoc.isWest() && logic.column == 3 && logic.row == 1 && logic.dragon == 0) {
                            logic.gameDescription = "You can't go that way... "
                            $("#commandResponse").html(logic.gameDescription)
                            $("#gameConsole").hide()
                            setTimeout(function () {
                                logic.gameDescription = " The dragon sleeps in a cave!"
                                logic.action()
                            }, 2000)
                            break;
                        }
                        if (currentLoc.isWest()) {
                            logic.row--
                            logic.gameDescription = "You are going west..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;


                    case "T":
                        if (logic.equipment != 0) {
                            logic.gameDescription = "You are carying something"
                            logic.action()
                            break;
                        }

                        itemID = currentLoc.locItem.indexOf(item + ITEM_SHIFT);

                        if (itemID != -1) {
                            if (items[item].specialMark == 0) {
                                logic.gameDescription = "You can't carry it"
                                logic.action()
                            } else {
                                logic.equipment = item + ITEM_SHIFT
                                currentLoc.locItem[itemID] = 0
                                logic.gameDescription = "You are taking " + items[item].fullName
                                logic.action()
                                logic.loadData()
                            }
                        } else {
                            logic.gameDescription = "There isn't anything like that here"
                            logic.action()
                        }
                        break;

                    case "D":
                        let playerItem = "";
                        for (let i = 0; i < items.length; i++) {
                            if (i == logic.equipment - ITEM_SHIFT) {
                                playerItem = items[i].name
                            }
                        }

                        if (playerItem != command[1]) {
                            logic.gameDescription = "You are not carrying it"
                            logic.action()
                            break;
                        }

                        //czy nie ma 3 przedmiotow z flaga1
                        let specialItemLimit = 0;
                        for (let i = 0; i < currentLoc.locItem.length; i++) {
                            if (currentLoc.locItem[i] != 0) {
                                if (items[currentLoc.locItem[i] - ITEM_SHIFT].specialMark == 1) {
                                    specialItemLimit++
                                }
                            }
                        }

                        if (logic.equipment == 0) {
                            logic.gameDescription = "You are not carrying anything"
                            logic.action()
                            break;
                        }
                        if (specialItemLimit >= SPECIAL_ITEM_LIMIT) {
                            logic.gameDescription = "You can't store any more here"
                            logic.action()
                            break;
                        }

                        itemID = currentLoc.locItem.indexOf(0);
                        if (itemID = -1) {
                            currentLoc.locItem.push(logic.equipment)
                        } else
                            currentLoc.locItem[itemID] = logic.equipment
                        logic.gameDescription = "You are about to drop " + items[logic.equipment - ITEM_SHIFT].fullName
                        logic.equipment = 0;
                        logic.action()
                        logic.loadData()
                        break;

                    case "U":
                        if (logic.equipment == 0) {
                            logic.gameDescription = "You are not carrying anything"
                            logic.action()
                            break;
                        }
                        if (items[logic.equipment - ITEM_SHIFT].name != command[1]) {
                            logic.gameDescription = "You aren't carrying anything like that"
                            logic.action()
                            break;
                        }

                        let effect;
                        for (let i = 0; i < reactions.length; i++) {
                            if (logic.equipment == reactions[i].needed)
                                effect = reactions[i]
                        }

                        let currentLocData = logic.column * 10 + logic.row + 11
                        if (effect.location != currentLocData) {
                            logic.gameDescription = "Nothing happened"
                            logic.action()
                            break;
                        }

                        if (effect.specialMark == "K") {
                            game.end()
                            break;
                        }

                        if (item.specialMark == "S") {
                            if (logic.skin == 0) {
                                logic.gameDescription = "Nothing happened"
                                logic.action()
                                break;
                            }
                        }

                        if (effect.specialMark == "N") {
                            logic.gameDescription = effect.message[0]
                            $("#commandResponse").html(logic.gameDescription)
                            $("#gameConsole").hide()
                            setTimeout(function () {
                                logic.gameDescription = effect.message[1]
                                $("#commandResponse").html(logic.gameDescription)
                                $("#gameConsole").hide()
                                setTimeout(function () {
                                    logic.gameDescription = effect.message[2]
                                    logic.action()

                                    setTimeout(function () {
                                        logic.equipment = effect.result
                                        logic.gameDescription = effect.message
                                        logic.loadData()
                                    }, ACTION_TIME)
                                }, ACTION_TIME)
                            }, ACTION_TIME)
                            break;
                        }
                        logic.equipment = effect.result

                        if (effect.specialMark == "L") {
                            logic.collectedStones++
                            currentLoc.locItem.push(logic.equipment)
                            logic.equipment = 0
                            logic.action()

                            if (logic.collectedStones == 6) {
                                if (effect.location == 43) {
                                    logic.equipment = 37
                                    logic.gameDescription = POISON_SHEEP
                                    for (let i = 0; i < currentLoc.locItem.length; i++) {
                                        currentLoc.locItem[i] = 0
                                    }
                                    $("#commandResponse").html(logic.gameDescription)
                                    $("#gameConsole").hide()
                                    setTimeout(function () {
                                        $("#commandResponse").html("What's now?")
                                        $("#gameConsole").hide()
                                        $("#gameConsole").focus()
                                    }, ACTION_TIME);
                                    logic.loadData()
                                    break;

                                }
                            }
                        }
                        if (effect.specialMark == "D") {
                            logic.dragon++
                            places[3][2].locImg = "DS68.bmp"
                            currentLoc.locItem[0] = logic.equipment
                            logic.equipment = 0
                            logic.gameDescription = effect.message[0]
                            $("#commandResponse").html(logic.gameDescription)
                            $("#gameConsole").hide()
                            setTimeout(function () {
                                logic.gameDescription = effect.message[1]
                                logic.action()
                                logic.loadData()
                            }, ACTION_TIME)
                            logic.skin++
                            break;
                        }


                        logic.gameDescription = effect.message
                        logic.action()
                        logic.loadData()
                        break;

                    default:
                        logic.gameDescription = "Try another word or V for vocabulary"
                        logic.action()
                        break;
                }

                $("#gameConsole").val("")
            }

        };
    }
}


function isUp(number) {
    if (number === 38) return true
    else false
}

function isDown(number) {
    if (number === 40) return true
    else false
}

function isLeft(number) {
    if (number === 37) return true
    else false
}

function isRight(number) {
    if (number === 39) return true
    else false
}

function pressedEnter(number) {
    if (number === 13) return true
    else false
}

function pressedSpace(number) {
    if (number === 32) return true
    else false
}

function whichDirection(consoleArg, keyNumber) {
    if (consoleArg.length === 1)
        return consoleArg

    if (consoleArg === "NORTH" || isUp(keyNumber)) {
        return "N"
    }
    if (consoleArg === "SOUTH" || isDown(keyNumber)) {
        return "S"
    }
    if (consoleArg === "WEST" || isLeft(keyNumber)) {
        return "W"
    }
    if (consoleArg === "EAST" || isRight(keyNumber)) {
        return "E"
    }
}

function whichAction(command) {
    if (command.length === 1)
        return command
    switch (command) {
        case "TAKE" :
            return "T"
        case "DROP" :
            return "D"
        case "USE" :
            return "U"
    }
}

function setCompassDefault() {
    $("#compassN").show()
    $("#compassS").show()
    $("#compassE").show()
    $("#compassW").show()
}

function setCurrentLocImg(currentLoc) {

    $("#locTitle").html(currentLoc.locTitle)

    $("#locImage").html("")

    let currentLocImg = document.createElement("IMG")
    currentLocImg.setAttribute("src", "img/" + currentLoc.locImg)
    $("#locImage").append(currentLocImg)


    $("#locImage").css('backgroundColor', currentLoc.locColor)
}

function putPrevText() {

    setTimeout(function () {
        document.body.onkeydown = function () {

            $("#commandResponse").show()
            $("#gameConsole").show()
            let prevText = logic.text.split(".")
            let locDescription = prevText[0];
            for (let i = 1; i < prevText.length; i++) {
                locDescription += ".<br><br>" + prevText[i]
            }
            $("#gameText").html(locDescription)
            document.body.onkeydown = ""
            $("#gameConsole").focus()
        }
    }, SAVE_TIME)
}
