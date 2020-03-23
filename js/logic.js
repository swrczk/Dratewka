var logic = {
    pion: 3,
    poziom: 6,
    casesens: 0,
    ekwipunek: 0,
    gameDescription: "",
    kamienie: 0,
    skin: 0,
    dragon: 0,
    text: "",
    action: function () {
        let comandResponse = document.getElementById("comandResponse")
        let gameConsole = document.getElementById("gameConsole")
        comandResponse.innerHTML = logic.gameDescription
        gameConsole.style.display = "none"
        setTimeout(function () {
            comandResponse.innerHTML = "What's now?"
            gameConsole.style.display = "inline"
            document.getElementById("gameConsole").focus()
        }, 2000); //00
    },
    loadData: function () {
        setTimeout(function () {

            setCompassDefault()

            let currentLoc = places[logic.pion][logic.poziom]

            setCurrentLocImg(currentLoc)

            let currentLocData = document.getElementById("gameDescription")
            let locDescription = "You can go:"

            if (currentLoc.isNorth()) {
                locDescription += " north"
                document.getElementById("compassN").style.display = "none"
            }
            if (currentLoc.isEast()) {
                if (currentLoc.isNorth()) {
                    locDescription += ","
                }
                locDescription += " east"
                document.getElementById("compassE").style.display = "none"
            }
            if (currentLoc.isSouth()) {
                if (currentLoc.isNorth() || currentLoc.isEast()) {
                    locDescription += ","
                }
                locDescription += " south"
                document.getElementById("compassS").style.display = "none"
            }
            if (currentLoc.isWest()) {
                if (currentLoc.isNorth() || currentLoc.isEast() || currentLoc.isSouth()) {
                    locDescription += ","
                }
                locDescription += " west"
                document.getElementById("compassW").style.display = "none"
            }


            var pos_ekw = 0;
            for (var i = 0; i < currentLoc.item.length; i++) {
                if (currentLoc.item[i] != 0) {
                    pos_ekw++
                }
            }
            if (pos_ekw == 0) {
                var see = "You see nothing"
            } else {
                var see = "You see"
                for (var i = 0; i < currentLoc.item.length; i++) {
                    if (currentLoc.item[i] != 0) {
                        see = see + " " + items[currentLoc.item[i] - 9].fullName
                    }

                    if (currentLoc.item[i + 1] != 0 && (i + 1) != currentLoc.item.length) {
                        see = see + ","
                    }
                }
            }

            if (logic.ekwipunek == 0)
                var carrying = "You are carrying nothing"
            else {
                var carrying = "You are carrying " + items[logic.ekwipunek - 9].fullName
            }

            currentLocData.innerHTML = locDescription + ". <br><br>" + see + ". <br><br>" + carrying + ". "
        }, 2000) //00   
    },
    startGame: function () {
        gameConsole.onkeydown = function (e) {

            let keyDownNumber = e.which
            let command = 0;
            let item = 0;

            if (pressedEnter(keyDownNumber) || isUp(keyDownNumber) || isDown(keyDownNumber) || isLeft(keyDownNumber) || isRight(keyDownNumber)) {
                var consoleArg = gameConsole.value.toUpperCase().trim()

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
                    } while (command[1] != items[item].name && item <= items.length)

                }

                switch (consoleArg) {
                    case "V": //info
                        logic.text = document.getElementById("gameDescription").textContent
                        var v = document.getElementById("gameDescription")
                        v.innerHTML = INSTRUCTION
                        v = document.getElementById("gameConsole")
                        v.style.visibility = "hidden"
                        v = document.getElementById("comandResponse")
                        v.style.visibility = "hidden"
                        setTimeout(function () {
                            document.body.onkeydown = function () {
                                var m = document.getElementById("comandResponse")
                                m.style.visibility = "visible"
                                m = document.getElementById("gameConsole")
                                m.style.visibility = "visible"
                                m = document.getElementById("gameDescription")
                                var teskt = logic.text.split(".")
                                var locDescription = teskt[0];
                                for (var i = 1; i < teskt.length; i++) {
                                    locDescription += ".<br><br>" + teskt[i]
                                }
                                m.innerHTML = locDescription
                                document.body.onkeydown = ""
                                document.getElementById("gameConsole").focus()
                            }
                        }, 10)
                        break;

                    case "G": //lore
                        logic.text = document.getElementById("gameDescription").textContent
                        var v = document.getElementById("gameDescription")
                        v.innerHTML = LORE_INFO
                        v = document.getElementById("gameConsole")
                        v.style.visibility = "hidden"
                        v = document.getElementById("comandResponse")
                        v.style.visibility = "hidden"
                        setTimeout(function () {
                            document.body.onkeydown = function () {
                                var m = document.getElementById("comandResponse")
                                m.style.visibility = "visible"
                                m = document.getElementById("gameConsole")
                                m.style.visibility = "visible"
                                m = document.getElementById("gameDescription")
                                var teskt = logic.text.split(".")
                                var locDescription = teskt[0];
                                for (var i = 1; i < teskt.length; i++) {
                                    locDescription += ".<br><br>" + teskt[i]
                                }
                                m.innerHTML = locDescription
                                document.body.onkeydown = ""
                                document.getElementById("gameConsole").focus()
                            }
                        }, 10)
                        break;

                    case "N":
                        if (places[logic.pion][logic.poziom].north == 1) {
                            logic.pion--
                            logic.gameDescription = "You are going north..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "S":
                        if (places[logic.pion][logic.poziom].south == 1) {
                            logic.pion++
                            logic.gameDescription = "You are going south..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "E":
                        if (places[logic.pion][logic.poziom].east == 1) {

                            logic.gameDescription = "You are going east..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;

                    case "W":
                        if (places[logic.pion][logic.poziom].west == 1 && logic.pion == 3 && logic.poziom == 1 && logic.dragon == 0) {
                            logic.gameDescription = "You can't go that way... "
                            var currentLocData = document.getElementById("comandResponse")
                            var miejsce2 = document.getElementById("gameConsole")
                            currentLocData.innerHTML = logic.gameDescription
                            miejsce2.style.display = "none"
                            setTimeout(function () {
                                logic.gameDescription = " The dragon sleeps in a cave!"
                                logic.action()
                            }, 2000)
                            break;
                        }
                        if (places[logic.pion][logic.poziom].west == 1) {
                            logic.poziom--
                            logic.gameDescription = "You are going west..."
                            logic.action()
                            logic.loadData()
                        } else {
                            logic.gameDescription = "You can't go that way"
                            logic.action()
                        }
                        break;


                    case "T":

                        if (logic.ekwipunek != 0) {
                            logic.gameDescription = "You are carying something"
                            logic.action()
                            break;
                        }


                        var tablica = places[logic.pion][logic.poziom].item.indexOf(item + 9);

                        if (tablica != -1) {
                            if (items[item].specialMark == 0) {
                                logic.gameDescription = "You can't carry it"
                                logic.action()
                            } else {
                                logic.ekwipunek = item + 9
                                places[logic.pion][logic.poziom].item[tablica] = 0
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
                        var ekw_nazw = "";
                        for (var i = 0; i < items.length; i++) {
                            if (i == logic.ekwipunek - 9) {
                                ekw_nazw = items[i].name
                            }
                        }

                        if (ekw_nazw != m[1]) {
                            logic.gameDescription = "You are not carrying it"
                            logic.action()
                            break;
                        }

                        //czy nie ma 3 przedmiotow z flaga1
                        var ok = 0;
                        for (var i = 0; i < places[logic.pion][logic.poziom].item.length; i++) {
                            if (places[logic.pion][logic.poziom].item[i] != 0) {
                                if (items[places[logic.pion][logic.poziom].item[i] - 9].specialMark == 1) {
                                    ok++
                                }
                            }
                        }

                        if (logic.ekwipunek == 0) {
                            logic.gameDescription = "You are not carrying anything"
                            logic.action()
                            break;
                        }
                        if (ok == 3) {
                            logic.gameDescription = "You can't store any more here"
                            logic.action()
                            break;
                        }

                        var tablica = places[logic.pion][logic.poziom].item.indexOf(0);
                        if (tablica = -1) {
                            places[logic.pion][logic.poziom].item.push(logic.ekwipunek)
                        } else
                            places[logic.pion][logic.poziom].item[tablica] = logic.ekwipunek
                        logic.gameDescription = "You are about to drop " + items[logic.ekwipunek - 9].fullName
                        logic.ekwipunek = 0;
                        logic.action()
                        logic.loadData()
                        break;

                    case "U":


                        if (logic.ekwipunek == 0) {
                            logic.gameDescription = "You are not carrying anything"
                            logic.action()
                            break;
                        }
                        if (items[logic.ekwipunek - 9].name != m[1]) {
                            logic.gameDescription = "You aren't carrying anything like that"
                            logic.action()
                            break;
                        }

                        var reakcja;
                        for (var i = 0; i < reactions.length; i++) {
                            if (logic.ekwipunek == reactions[i].needed)
                                reakcja = reactions[i]
                        }

                        var currentLocData = logic.pion * 10 + logic.poziom + 11
                        if (reakcja.location != currentLocData) {
                            logic.gameDescription = "Nothing happened"
                            logic.action()
                            break;
                        }

                        if (reakcja.specialMark == "K") {
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

                        if (reakcja.specialMark == "N") {
                            logic.gameDescription = reakcja.komunikat[0]
                            var currentLocData = document.getElementById("comandResponse")
                            var miejsce2 = document.getElementById("gameConsole")
                            currentLocData.innerHTML = logic.gameDescription
                            miejsce2.style.display = "none"
                            setTimeout(function () {
                                logic.gameDescription = reakcja.komunikat[1]
                                var currentLocData = document.getElementById("comandResponse")
                                var miejsce2 = document.getElementById("gameConsole")
                                currentLocData.innerHTML = logic.gameDescription
                                miejsce2.style.display = "none"
                            }, 2000)
                            setTimeout(function () {
                                logic.gameDescription = reakcja.komunikat[2]
                                logic.action()
                            }, 4001)
                            setTimeout(function () {
                                logic.ekwipunek = reakcja.result
                                logic.gameDescription = reakcja.komunikat
                                logic.loadData()
                            }, 6002)
                            break;
                        }
                        logic.ekwipunek = reakcja.result

                        if (reakcja.specialMark == "L") {
                            logic.kamienie++
                            places[logic.pion][logic.poziom].item.push(logic.ekwipunek)
                            logic.ekwipunek = 0
                            logic.action()

                            if (logic.kamienie == 6) {
                                if (reakcja.location == 43) {
                                    logic.ekwipunek = 37
                                    logic.gameDescription = "Your fake sheep is full of poison and ready to be eaten by the dragon"
                                    for (var i = 0; i < places[logic.pion][logic.poziom].item.length; i++) {
                                        places[logic.pion][logic.poziom].item[i] = 0
                                    }
                                    var currentLocData = document.getElementById("comandResponse")
                                    var miejsce2 = document.getElementById("gameConsole")
                                    currentLocData.innerHTML = logic.gameDescription
                                    miejsce2.style.display = "none"
                                    setTimeout(function () {
                                        currentLocData.innerHTML = "What's now?"
                                        miejsce2.style.display = "inline"
                                        document.getElementById("gameConsole").focus()
                                    }, 3500); //00
                                    logic.loadData()
                                    break;

                                }
                            }
                        }
                        if (reakcja.specialMark == "D") {
                            logic.dragon++
                            places[3][2].locImg = "DS68.bmp"
                            places[logic.pion][logic.poziom].item[0] = logic.ekwipunek
                            logic.ekwipunek = 0
                            logic.gameDescription = reakcja.komunikat[0]
                            var currentLocData = document.getElementById("comandResponse")
                            var miejsce2 = document.getElementById("gameConsole")
                            currentLocData.innerHTML = logic.gameDescription
                            miejsce2.style.display = "none"
                            setTimeout(function () {
                                logic.gameDescription = reakcja.komunikat[1]
                                logic.action()
                                logic.loadData()
                            }, 2000)
                            logic.skin++
                            break;
                        }


                        logic.gameDescription = reakcja.komunikat
                        logic.action()
                        logic.loadData()
                        break;

                    default:
                        logic.gameDescription = "Try another word or V for vocabulary"
                        logic.action()
                        break;
                }

                gameConsole.value = ""
                logic.casesens = 0
            }

            if (pressedSpace(keyDownNumber))
                logic.casesens = 1
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

function setCompassDefault(){
    document.getElementById("compassN").style.display = "block"
    document.getElementById("compassS").style.display = "block"
    document.getElementById("compassE").style.display = "block"
    document.getElementById("compassW").style.display = "block"
}

function setCurrentLocImg(currentLoc){

    let currentLocData = document.getElementById("locTitle")
    currentLocData.innerHTML = currentLoc.locTitle

    currentLocData = document.getElementById("locImage")
    currentLocData.innerHTML = ""

    let currentLocImg = document.createElement("IMG")
    currentLocImg.setAttribute("src", "img/" + currentLoc.locImg)
    currentLocData.appendChild(currentLocImg)


    currentLocData.style.backgroundColor = currentLoc.locColor
}