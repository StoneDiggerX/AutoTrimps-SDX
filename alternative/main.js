console.log("start load main module");

this.mainloop = function() {
    console.log(">>> run main task");
    //var game = unsafeWindow.game;

    //manageUpgrades(game);
    //manageJobs(game, CFG);
    //manageHousings(game, CFG);
    //manageStorages(game, CFG);

    setTimeout(this.mainloop.bind(this), 1000);
};

console.log("execute main module");
this.mainloop();

