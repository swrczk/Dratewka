var logic = (function(){
    function makeAction (keyDownNumber) {
        let currentLoc = places[Math.floor(player.instance / 10)][player.instance % 10]
        let command = 0;
        let calledItemID = 0;
        let consoleArg = $("#gameConsole").val().toUpperCase().trim()

        if (consoleArg.includes(" ")) {
            command = consoleArg.split(" ")
            consoleArg = engine.whichAction(command[0])
            calledItemID = engine.getItemID(command[1])
        } else {
            consoleArg = engine.whichDirection(consoleArg, keyDownNumber)
        }
        
        console.log('makeAction', consoleArg);

        if ("N|S|E|W".includes(consoleArg))
            currentLoc.changePlace(consoleArg)
        else
            switch (consoleArg) {
                //lepiej było to rozbić
                case "V" :
                    engine.text = $("#gameText").text()
                    $("#gameText").html(INSTRUCTION)
                    $("#gameConsole").hide()
                    $("#commandResponse").hide()
                    engine.putPrevText()
                    break;
                case "G": //info || lore
                    engine.text = $("#gameText").text()
                    $("#gameText").html(LORE_INFO)
                    $("#gameConsole").hide()
                    $("#commandResponse").hide()
                    engine.putPrevText()
                    break;
                case "T":
                    if (engine.emptyEquipment()) logic.takeItem(currentLoc, calledItemID)
                    break;

                case "D":

                    if (!engine.emptyEquipment()) {
                        logic.dropItem(currentLoc, calledItemID)
                    }
                    break;

                case "U":
                    if (player.equipment === 0) {
                        engine.gameDescription = "You are not carrying anything"
                    } else if (player.equipment !== calledItemID) {
                        engine.gameDescription = "You aren't carrying anything like that"
                    } else {

                        let effect;
                        for (let i = 0; i < reactions.length; i++) {
                            if (player.equipment === reactions[i].needed)
                                effect = reactions[i]
                        }

                        if (!effect || effect.location !== player.instance) {
                            engine.gameDescription = "Nothing happened"
                            engine.displayAction()

                        } else logic.useItem(currentLoc, effect)
                    }
                    break

                default:
                    engine.gameDescription = "Try another word or V for vocabulary"
                    break;
            }

        if (engine.gameDescription) engine.displayAction()
        $("#gameConsole").val("")
    }

    function takeItem (currentLoc, calledItemID) {

        if (currentLoc.locItem.indexOf(calledItemID) !== -1) {
            if (items[calledItemID].canLift()) {
                player.equipment = calledItemID
                currentLoc.locItem.splice(currentLoc.locItem.indexOf(calledItemID), 1)
                engine.gameDescription = "You are taking " + items[calledItemID].fullName
                engine.loadData()
            } else {
                engine.gameDescription = "You can't carry it"
            }
        } else {
            engine.gameDescription = "There isn't anything like that here"
        }
    }

    function dropItem (currentLoc, calledItemID) {
        if (calledItemID === -1 || player.equipment !== calledItemID) {
            engine.gameDescription = "You are not carrying it"
        } else {
            //czy nie ma 3 przedmiotow z flaga1
            let specialItemLimit = 0;
            for (let i = 0; i < currentLoc.locItem.length; i++) {
                if (currentLoc.locItem[i] !== 0) {
                    specialItemLimit++
                }
            }

            if (specialItemLimit >= SPECIAL_ITEM_LIMIT) {
                engine.gameDescription = "You can't store any more here"
            } else {
                currentLoc.locItem.push(player.equipment)
                engine.gameDescription = "You are about to drop " + items[player.equipment].fullName
                player.equipment = 0
                engine.loadData()
            }
        }
    }

    function useItem (currentLoc, effect) {
        switch (effect.specialMark) {
            case "K":
                game.end()
                break
            case "S":
                itemsAction.cuttingDragonSkin(effect)
                break

            case "N":
                itemsAction.digging(0, effect)
                player.equipment = effect.result
                break

            case "L":
                itemsAction.importantItem(currentLoc, effect)
                break

            case "D":
                itemsAction.feedingDragon(effect, currentLoc)
                break

            default:
                player.equipment = effect.result
        }

        engine.gameDescription = effect.message
        engine.loadData()
    }

    return{
        makeAction:makeAction,
        takeItem:takeItem,
        dropItem:dropItem,
        useItem:useItem
    }
})();

