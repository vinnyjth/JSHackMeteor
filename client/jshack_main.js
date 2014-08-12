function mouseClickedMainCanvas(event) {
    //grab the location of the mouse in tile units
    mapX = Math.floor(event.offsetX / tileSize.x);
    mapY = Math.floor(event.offsetY / tileSize.y);

}
function mouseClickedGUI(event) {
    //grab the location of the mouse in tile units
    var x = event.offsetX;
    var y = event.offsetY;
    console.log(x + " " + y);


}
function changeCanvasSize(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
}
//handle dragging of inventory
//credit to Laurence of StackOverflow
//http://stackoverflow.com/questions/17992543/how-do-i-drag-an-image-smoothly-around-the-screen-using-pure-javascript
function startDrag(e) {
    if (!e) {
        e = window.event;
    }
    // IE uses srcElement, others use target
    var targ = e.target ? e.target : e.srcElement;
    if (targ.className != 'dragme') {
        return
    }
    // calculate event X, Y coordinates
    offsetX = e.clientX;
    offsetY = e.clientY;

    // assign default values for top and left properties
    if (!targ.style.left) {
        targ.style.left = '0px'
    }
    if (!targ.style.top) {
        targ.style.top = '0px'
    }
    // calculate integer values for top and left
    // properties
    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);
    drag = true;
    // move div element
    document.onmousemove = dragDiv;
}

function dragDiv(e) {
    if (!drag) {
        return
    }
    if (!e) {
        var e = window.event
    }
    var targ = e.target ? e.target : e.srcElement;
    // move div element
    targ.style.left = coordX + e.clientX - offsetX + 'px';
    targ.style.top = coordY + e.clientY - offsetY + 'px';
    return false;
}

function stopDrag() {
    drag = false;
}



function clearCanvas(canvasClearing) {
    canvasClearing.clearRect(0, 0, canvas.width, canvas.height)
}
//Add the box to the element object
function drawBox(style, sizeX, sizeY, boxX, boxY, index, elementName, elementList) {
    var boxStyles = {};

    //important because the draw function needs to know how to draw it.
    boxStyles.elementType = 'box';

    //the color of the box
    boxStyles.fillStyle = style;

    //determine the bottom right corner based on the box size
    boxStyles.secondX = boxX + sizeX;
    boxStyles.secondY = boxY + sizeY;

    //top right corner is easy.
    boxStyles.locX = boxX;
    boxStyles.locY = boxY;

    boxStyles.index = index;

    elementList[elementName] = boxStyles;
}
function drawImage(image, imageX, imageY, index, elementName, elementList) {
    var imageStyles = {};

    //important because the draw function needs to know how to draw it.
    imageStyles.elementType = 'image';

    imageStyles.image = image;

    //top right corner is easy.
    imageStyles.locX = imageX;
    imageStyles.locY = imageY;

    imageStyles.width = image.naturalWidth;
    imageStyles.height = image.Height;

    imageStyles.index = index;

    elementList[elementName] = imageStyles;

}
function drawMap(map, index) {
    console.log()
    var i = 0;
    for (var dy = 0; dy < map.length; dy++) {
        for (var dx = 0; dx < map[dy].length; dx++) {
            i++;
            var tileStyle = mapTileHandler(map[dy][dx]);
            if (typeof tileStyle === 'string') {
                drawBox(tileStyle, tileSize.x, tileSize.y, tileSize.x * dx, tileSize.y * dy, 1, ("mapTile" + i), e);
            } else {
                drawImage(tileStyle, tileSize.x * dx, tileSize.y * dy, index, ("mapTile" + i), e);
            }
        }
    }
}
function drawPlayer() {
    if (e['player']) {
        //Yes! Good

    } else {
        //Bad! Let's draw him.
        drawImage(playerImg, player.loc.x, player.loc.y, 5, 'player', e);
    }
}
function mapTileHandler(tileNumber) {

    if (tileNumber == 0) {
        return wall;
    }
    if (tileNumber == 1) {
        return floor;
    }

    if (tileNumber == 4) {
        return halfOpacity;
    }
    if (tileNumber == 5) {
        return twoThirdsOpacity;
    }
    return wall;
}
//another important function. Takes all the elements from the element list (e) and draws them on the screen
// still need to find a way to handle z indexs. Somehow need to rearrange keys in object by the z index.

function sortObjectByZ(elements) {
    var sortedElements = [];
    for (var element in elements) {
        sortedElements.push([element, elements[element].index])
    }
    return sortedElements.sort(function(a, b) {
        return a[1] - b[1]
    });
}
function drawScreen(elements, canvasToDrawTo) {
    clearCanvas(canvasToDrawTo);
    var elementArray = sortObjectByZ(elements);
    for (var i = 0; i < elementArray.length; i++) {
        //drawing a box is different from drawing a square or other object
        var ePrime = elements[elementArray[i][0]];
        if (ePrime.elementType == "box") {
            canvasToDrawTo.fillStyle = ePrime.fillStyle;
            canvasToDrawTo.fillRect(ePrime.locX, ePrime.locY, ePrime.secondX, ePrime.secondY);
        } else if (ePrime.elementType == "image") {
            canvasToDrawTo.drawImage(ePrime.image, ePrime.locX, ePrime.locY);
        }
    }
}


Meteor.startup(function(){
    canvas = document.getElementById('JSHack');
     c = canvas.getContext('2d');

     guiCanvas = document.getElementById('GUI');
     gui = guiCanvas.getContext('2d');

    c.globalAlpha = .5;



    //very important this object, know as the element contains all items that need to be drawn
    //might contain data about player/items/monsters later on, who knows XD
    //the moving increment for all objects

    guiSize = {
        x: 300,
        y: 300
    };

    wall = new Image();
    wall.src = "img/wall.png";

    floor = new Image();
    floor.src = "img/dirt.png";

    playerImg = new Image();
    playerImg.src = "img/player.png";

    halfOpacity = new Image();
    halfOpacity.src = "img/opacityfifty.png";

    twoThirdsOpacity = new Image();
    twoThirdsOpacity.src = "img/opacitytwothirds.png";

    //rebuild this later, perhaps using the same object? Kinda hacked in as is
    e = {};
    g = {};


    //The player object
    player = {
        loc: {
            x: 0,
            y: 0
        },
        image: playerImg
    };

    //we need some events dear watson
    window.addEventListener("load", eventWindowLoaded, false);
    //window.addEventListener("keydown", eventKeyPressed, true);
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;


    canvas.addEventListener("click", mouseClickedMainCanvas, false);
    guiCanvas.addEventListener("click", mouseClickedGUI, false);





    //when the page loads:
    function eventWindowLoaded() {
        
        changeCanvasSize(canvas, size.x, size.y);
        changeCanvasSize(guiCanvas, guiSize.x, guiSize.y);
        drawPlayer();
        //drawBox("#930c16", guiCanvas.width, guiCanvas.height, 0, 0, 0, 'gui', g);
        //JSHack();
    }
    //when a key is pressed
    /*function eventKeyPressed(keyEvent) {


        var keyCode = keyEvent.keyCode;

        //check for the inventory button is pressed
        if (keyCode == 73) {
            if (guiCanvas.style.display == "block") {
                guiCanvas.style.display = "none"
            } else {
                guiCanvas.style.display = "block";
            }

        }
        if (keyCode == 37) {
            keyEvent.preventDefault();
            movePlayer(player.loc.x - tileSize.x, player.loc.y);
        } else if (keyCode == 38) {
            keyEvent.preventDefault();
            movePlayer(player.loc.x, player.loc.y - tileSize.y);
        } else if (keyCode == 39) {
            keyEvent.preventDefault();
            movePlayer(player.loc.x + tileSize.x, player.loc.y);
        } else if (keyCode == 40) {
            keyEvent.preventDefault();
            movePlayer(player.loc.x, player.loc.y + tileSize.y);
        };

        if (keyCode == 70) {
            calculateFOV(level1, player, 30);
            drawMap(level1.fovMap, 3);
        }
        //draw all elements on screen.
        //Needed keycodes: Left: 37
        //Up: 38
        //Right: 39
        //Down: 40
    };*/


    //move the player to a specific point in the map



    //do stuff that needs to be done every frame. The main game loop.

    Deps.autorun(function(){

    });
});
Meteor.subscribe('mazes', function(){
    drawMap(Mazes.find().fetch()[0].map, 1);
    drawPlayer();

    drawScreen(e, c);
    drawScreen(g, gui);
});