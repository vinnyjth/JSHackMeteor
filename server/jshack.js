function mapGenerator(sizeX, sizeY) {
    var fovMap = [];
    this.fovMap = [];
    var mapCol = [];
    var mapRow = [];
    this.sizeX = sizeX;
    this.sizeY = sizeY;
    //Generates a blank maze
    this.randomMaze = randomMaze;


    function randomMaze() {
        var map = [];
        for (var dy = 0; dy < sizeY; dy++) {
            var mapRow = [];
            for (var dx = 0; dx < sizeX; dx++) {
                if (Math.random() > .43) {
                    mapRow[dx] = 0;
                } else {
                    mapRow[dx] = 1;
                };
            }
            map[dy] = mapRow;
        }
        return map;
    };
    this.blankMaze = blankMaze;

    function blankMaze(tileCode) {
        var map = [];
        for (var dy = 0; dy < sizeY; dy++) {
            var mapRow = [];
            for (var dx = 0; dx < sizeX; dx++) {
                mapRow[dx] = tileCode;
            }
            map[dy] = mapRow;
        }
        return map;
    };


    this.cellularStep = cellularStep;

    function cellularStep(map) {
        var newMap = [];
        var deathLimit = 3;
        var birthLimit = 5;
        for (var y = 0; y < map.length; y++) {
            var mapRow = [];
            for (var x = 0; x < map[y].length; x++) {
                var wallsAround = countAliveNeighbors(map, x, y);

                if (map[y][x] == 0) {
                    if (wallsAround > 4) {
                        mapRow[x] = 0;
                    } else {
                        mapRow[x] = 1;
                    }
                } else {
                    if (wallsAround > 5) {
                        mapRow[x] = 0;
                    } else {
                        mapRow[x] = 1;
                    }
                }
                newMap[y] = mapRow;

            }
        }
        return newMap;
    };

    this.buildCave = buildCave;

    function buildCave(steps) {
        var theMaze = randomMaze();
        for (var i = 0; i < steps; i++) {
            theMaze = cellularStep(theMaze);
        };
        return theMaze;
    }

};

function countAliveNeighbors(map, cellX, cellY) {
    var count = 0;
    for (var i = -1; i < 2; i++) {
        for (var j = -1; j < 2; j++) {
            var neighborX = cellX + j;
            var neighborY = cellY + i;
            if (i == 0 && j == 0) {} else if (neighborX < 0 || neighborY < 0 || neighborY >= map.length || neighborX > map[0].length) {
                count++;
            } else if (map[neighborY][neighborX] == 0) {
                count++;
            }
        }
    }
    return count;
};



function placePlayerInMap(map) {
    var playerMapLocation = {
        x: 0,
        y: 0
    };
    for (var dy = 0; dy < map.length; dy++) {
        for (var dx = 0; dx < map[dy].length; dx++) {
            if (map[dy][dx] == 1 && countAliveNeighbors(map, dx, dy) > 4) {
                //drawPlayer();
                //movePlayer(dx * tileSize.x, dy * tileSize.y);
                return;
            }
        }
    }
};

function calculateFOV(map, player, viewRadius) {
    map.fovMap = map.blankMaze(5);
    for (var i = 0; i < 360; i += 8) {
        var x = Math.ceil(Math.cos(i) * 0.01745);
        var y = Math.ceil(Math.sin(i) * 0.01745);
        console.log(x + " " + y);
        calculateRealFOV(x, y, player, viewRadius, map, map.fovMap);
    }
};

function calculateRealFOV(x, y, player, viewRadius, level, fovMap) {
    var dx = (player.loc.x / tileSize.x);
    var dy = (player.loc.y / tileSize.y);
    for (var i = 0; i < viewRadius; i++) {
        if ((dx > level.fovMap[1].length) || (dx < 0) || (dy > level.fovMap.length) || (dy < 0)) {
            return;
        }
        level.fovMap[dy][dx] = 4;
        if (level.map[dy][dx] == 0) {
            return;
        }
        dx += x;
        dy += y;

    }
};

function movePlayer(desiredX, desiredY) {
    var locInMaze = mainMap[desiredY / tileSize.y][desiredX / tileSize.x];
    if (locInMaze == 1) {
        player.loc = {
            x: desiredX,
            y: desiredY
        };
        e['player'].locX = desiredX;
        e['player'].locY = desiredY;
        return true;

    } else {
        return false;
    };
};

function createMap(name, mapGenerator){
	var generator = new mapGenerator(size.x / tileSize.x, size.y / tileSize.y);
	var mainMap = generator.buildCave(2);
	Mazes.insert({name: name, map: mainMap});	
}


function redoMap(name, mapGenerator){
    var generator = new mapGenerator(size.x / tileSize.x, size.y / tileSize.y);
    var mainMap = generator.buildCave(2);
    return Mazes.update({name: name}, {map: mainMap});
}
Meteor.startup(function() {

	if(Mazes.find().fetch().length === 0){
		createMap("level1", mapGenerator);
	}
   // code to run on server at startup
});

Meteor.publish('commands', function(){
	return Commands.find();
});

Meteor.publish('mazes', function(){
	return Mazes.find();
});

Deps.autorun(function(){

});

Meteor.methods({
   newCommand: function(command, userId){
        Commands.insert({text: command, when: new Date()});
        if(command === "newmap"){
            return redoMap(Mazes.findOne().name, mapGenerator);
        }else{
            return command;
        }
   }
});
