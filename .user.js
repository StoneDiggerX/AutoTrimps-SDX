// ==UserScript==
// @name         AutoTrimps-StoneDigger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate some trimps functions
// @author       StoneDigger
// @match        *trimps.github.io*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// ==/UserScript==
if(!unsafeWindow.settings){
    unsafeWindow.settings = {
        autoBuild:true
    };
}

var autoTrimpsd = (function() {

    // Your code here...
    var CFG = [];
    CFG["manageStorages"] = {};
    CFG["manageStorages"].barnThreshold = 0.9; /*percentage at which minimum*/
    CFG["manageStorages"].shedThreshold = 0.9; /*to buy storage*/
    CFG["manageStorages"].forgeThreshold = 0.9; /*from 0 (min) to 1 (max)*/

    CFG["manageHousings"] = {};
    CFG["manageHousings"].Hut = {};
    CFG["manageHousings"].Hut.maxNr = 100;
    CFG["manageHousings"].House = {};
    CFG["manageHousings"].House.maxNr = 100;
    CFG["manageHousings"].Mansion = {};
    CFG["manageHousings"].Mansion.maxNr = 100;
    CFG["manageHousings"].Hotel = {};
    CFG["manageHousings"].Hotel.maxNr = 100;
    CFG["manageHousings"].Resort = {};
    CFG["manageHousings"].Resort.maxNr = 100;
    CFG["manageHousings"].Gateway = {};
    CFG["manageHousings"].Gateway.maxNr = 100;
    CFG["manageHousings"].Collector = {};
    CFG["manageHousings"].Collector.maxNr = 100;
    CFG["manageHousings"].Warpstation = {};
    CFG["manageHousings"].Warpstation.maxNr = 100;

    CFG["manageJobs"] = {};
    CFG["manageJobs"].Farmer = {};
    CFG["manageJobs"].Farmer.fraction= 0.25;
    CFG["manageJobs"].Lumberjack = {};
    CFG["manageJobs"].Lumberjack.fraction = 0.25;
    CFG["manageJobs"].Miner = {};
    CFG["manageJobs"].Miner.fraction = 0.5;
    CFG["manageJobs"].Scientist = {};
    CFG["manageJobs"].Scientist.fraction = 0.02;
    CFG["manageJobs"].Trainer = {};
    CFG["manageJobs"].Trainer.fraction = 1;
    CFG["manageJobs"].Explorer = {};
    CFG["manageJobs"].Explorer.fraction = 0.01;

    function isBuildingInQueue(game, a){for(var c in game.global.buildingsQueue)if(game.global.buildingsQueue[c].includes(a))return!0}

    console.clear();
    console.log("start AutoTrimps");

    function getPackratMultiplier(game) {
        var packratMultiplier = 1 + game.portal.Packrat.level * (game.portal.Packrat.modifier);
        return packratMultiplier;
    }

    function getResources(game) {
        var resources = {};
        resources.currentFood = game.resources.food.owned;
        resources.currentWood = game.resources.wood.owned;
        resources.currentMetal = game.resources.metal.owned;

        resources.maxFood = game.resources.food.max * getPackratMultiplier(game);
        resources.maxWood = game.resources.wood.max * getPackratMultiplier(game);
        resources.maxMetal = game.resources.metal.max * getPackratMultiplier(game);

        return resources;
    }

    function getBuildingPrice(building) {
        var priceList = {};
        var costs = building.cost;

        for (var item in costs) {
            var itemPrice = getBuildingItemPrice(building, item, false, 1);
            priceList[item] = itemPrice;
        }
        //console.log(priceList);
        return priceList;
    }

    function safeBuyBuilding(game, building) {
        if (isBuildingInQueue(game, building))
            return false;
        if (game.buildings[building].locked)
            return false;

        if (!game.buildings[building].locked && canAffordBuilding(building)) {
            console.log("buy " + building + " as a best option");
            buyBuilding(building, true, true);
        }
        return true;
    }

    function manageStorages(game, CFG) {
        var resources = getResources(game);
        //console.log(resources);
        if((resources.currentFood / resources.maxFood) >= CFG["manageStorages"].barnThreshold) {
            console.log("buy one Barn");
            safeBuyBuilding(game, "Barn");
        }
        if((resources.currentWood / resources.maxWood) >= CFG["manageStorages"].shedThreshold) {
            console.log("buy one Shed");
            safeBuyBuilding(game, "Shed");
        }
        if((resources.currentMetal / resources.maxMetal) >= CFG["manageStorages"].forgeThreshold) {
            console.log("buy one Forge");
            safeBuyBuilding(game, "Forge");
        }
    }

    function buyEfficientHousing(game, CFG, housingList, sortItem){
        var unlockedHousing = [];
        for (var house in housingList) {
            if (game.buildings[housingList[house]].locked === 0) {
                unlockedHousing.push(housingList[house]);
            }
        }

        //console.log(unlockedHousing);
        var housingsOrder = [];
        for (house in unlockedHousing) {
            var building = game.buildings[unlockedHousing[house]];
            var priceList = getBuildingPrice(building);
            //console.log(priceList);
            //console.log(priceList.food);
            var ratio = priceList[sortItem]/ building.increase.by;
            housingsOrder.push({
                'name': unlockedHousing[house],
                'ratio': ratio
            });
        }
        housingsOrder.sort(function (a, b) {
            return a.ratio - b.ratio;
        });
        //console.log(housingsOrder);
        if(housingsOrder.length){
            var bestfoodBuilding = null;
            var bb = housingsOrder[0];
            var max = CFG["manageHousings"][bb.name].maxNr;
            //console.log("max = " + max);
            if (game.buildings[bb.name].owned < max || max == -1) {
                bestfoodBuilding = bb.name;
            }
            if (bestfoodBuilding) {
                safeBuyBuilding(game, bestfoodBuilding);
            }
        }
    }


    function manageHousings(game, CFG) {
        var foodHousing = ["Hut", "House", "Mansion", "Hotel", "Resort"];
        var gemHousing = ["Hotel", "Resort", "Gateway", "Collector", "Warpstation"];

        buyEfficientHousing(game, CFG, foodHousing, "food");
        buyEfficientHousing(game, CFG, gemHousing, "gem");
    }

    function manageUpgrades(game){
        var upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Speedexplorer', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular',
                           'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm',
                           'Gigastation', 'Shieldblock', 'Potency', 'Magmamancers',
                           'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Supershield', 'Gymystic'];
        for (var upgrade in upgradeList) {
            upgrade = upgradeList[upgrade];
            //console.log(upgrade);
            var gameUpgrade = game.upgrades[upgrade];
            //console.log(gameUpgrade);
            var available = (gameUpgrade.allowed > gameUpgrade.done && canAffordTwoLevel(gameUpgrade));

            if (upgrade == 'Coordination' && !canAffordCoordinationTrimps()) continue;
            if (!available) continue;
            if (game.upgrades.Scientists.done < game.upgrades.Scientists.allowed && upgrade != 'Scientists') continue;

            buyUpgrade(upgrade, true, true);
            console.log('Upgraded ' + upgrade, " upgrades");
        }
    }

    function safeBuyJob(game, jobTitle, amount) {
        if (!Number.isFinite(amount) || amount === 0 || typeof amount === 'undefined' || Number.isNaN(amount)) {
            return false;
        }
        var checkAmount = amount;
        if (amount == null)
            checkAmount = 1;
        if (canAffordJob(jobTitle, false, checkAmount) && !game.jobs[jobTitle].locked) {
            var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            var result = false;
            //safe game confuration
            var gameConfig = [game.global.buyAmt,game.global.firing,game.global.lockTooltip,game.global.maxSplit];
            if (amount > 0) {
                game.global.firing = false;
                game.global.buyAmt = amount;
                result = canAffordJob(jobTitle, false) && freeWorkers > 0;
                if (!result) {
                    game.global.buyAmt = 'Max';
                    game.global.maxSplit = 1;
                    result = canAffordJob(jobTitle, false) && freeWorkers > 0;
                }
            }

            if (result) {
                console.log("Hiring " + (game.global.buyAmt) + "(" + amount + ") " + jobTitle + "s");
                buyJob(jobTitle, true, true);
            }
            // restore game confuration
            game.global.buyAmt=gameConfig[0];
            game.global.firing=gameConfig[1];
            game.global.lockTooltip=gameConfig[2];
            game.global.maxSplit=gameConfig[3];
            return true;
        }
        else {
            return false;
        }

    }

    function manageJobs(game, CFG){
        var jobPrioList = ["Trainer", "Explorer", "Scientist", "Miner", "Lumberjack", "Farmer"];

        var totalWorkers = game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
        //console.log("totalWorkers=" + totalWorkers);

        var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        var ammountTrainer = Math.ceil(CFG["manageJobs"]["Trainer"].fraction * freeWorkers);
        safeBuyJob(game, "Trainer", ammountTrainer);

        freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        var reserveForTrainer = 0.05 * game.jobs.Trainer.owned;
        if (freeWorkers > reserveForTrainer) {
            if (freeWorkers > reserveForTrainer) {
                freeWorkers = freeWorkers - reserveForTrainer;
               //console.log('freeWorkers=' + freeWorkers);

                var ammountExplorer = Math.round(CFG["manageJobs"]["Explorer"].fraction * totalWorkers)- game.jobs.Explorer.owned;
                if(ammountExplorer>=freeWorkers) {
                    ammountExplorer = freeWorkers;
                }
                safeBuyJob(game, "Explorer", ammountExplorer);

                var ammountScientist = Math.round(CFG["manageJobs"]["Scientist"].fraction * totalWorkers) - game.jobs.Scientist.owned;
                //console.log("ammountScientist=" + ammountScientist);
                if(ammountExplorer>=freeWorkers) {
                    ammountExplorer = freeWorkers;
                }
                safeBuyJob(game, "Scientist", ammountScientist);

                var ammountMiner = Math.round(CFG["manageJobs"]["Miner"].fraction * (freeWorkers + totalWorkers)) - game.jobs.Miner.owned;
                //console.log('ammountMiner=' + ammountMiner);
                if(ammountExplorer>=freeWorkers) {
                    ammountExplorer = freeWorkers;
                }
                safeBuyJob(game, "Miner", ammountMiner);

                var ammountLumberjack = Math.round(CFG["manageJobs"]["Lumberjack"].fraction * (freeWorkers + totalWorkers)) - game.jobs.Lumberjack.owned;
                //console.log('ammountLumberjack=' + ammountLumberjack);
                if(ammountExplorer>=freeWorkers) {
                    ammountExplorer = freeWorkers;
                }
                safeBuyJob(game, "Lumberjack", ammountLumberjack);

                var ammountFarmer = Math.round(CFG["manageJobs"]["Farmer"].fraction * (freeWorkers + totalWorkers)) - game.jobs.Farmer.owned;
                //console.log('ammountFarmer=' + ammountFarmer);
                if(ammountExplorer>=freeWorkers) {
                    ammountExplorer = freeWorkers;
                }
                safeBuyJob(game, "Farmer", ammountFarmer);
            }
        }
    }

    this.mainloop = function() {
        //console.clear();
        //console.log(">>> start check of resources");
        var game = unsafeWindow.game;

        manageUpgrades(game);
        manageJobs(game, CFG);
        manageHousings(game, CFG);
        manageStorages(game, CFG);

        setTimeout(this.mainloop.bind(this), 1000);
    };

    this.mainloop();
})();