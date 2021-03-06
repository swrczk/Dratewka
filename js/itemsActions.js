var itemsAction = (function () {

    function digging(n, effect) {
        engine.gameDescription = effect.message[n]
        $("#commandResponse").html(engine.gameDescription)
        $("#gameConsole").hide()
        setTimeout(function () {
            if (n + 1 < effect.message.length)
                digging(n + 1, effect)
            else
                engine.defaultConsole()
        }, ACTION_TIME)
    }

    function feedingDragon(effect, currentLoc) {
        player.dragon++
        player.equipment = 0
        engine.gameDescription = effect.message[0]
        $("#commandResponse").html(engine.gameDescription)
        $("#gameConsole").hide()
        setTimeout(function () {
            engine.gameDescription = effect.message[1]
            currentLoc.locItem[0] = effect.result
        }, ACTION_TIME)
        player.skin++
    }

    function cuttingDragonSkin(effect) {
        if (player.skin === 0) {
            engine.gameDescription = "Nothing happened"
            engine.displayAction()
        }
        player.equipment = effect.result
    }

    function importantItem(currentLoc, effect) {
        player.necessaryItems++
        currentLoc.locItem.push(effect.result)
        player.equipment = 0
        engine.displayAction()

        if (player.necessaryItems === 6) {
            if (effect.location === 43) {
                player.equipment = 28
                engine.gameDescription = POISON_SHEEP
                currentLoc.locItem = []
                $("#commandResponse").html(engine.gameDescription)
                $("#gameConsole").hide()
                setTimeout(function () {
                    engine.defaultConsole()
                }, ACTION_TIME)
            }
        }
    }

    return{
        digging:digging,
        feedingDragon:feedingDragon,
        cuttingDragonSkin:cuttingDragonSkin,
        importantItem:importantItem
    }
})();