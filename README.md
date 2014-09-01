#MaxTouch.JS


A Javascript Lib for Touch Events.


##Tutorial
Download (clone) MaxTouch.js into your work Folder.
Add index.html:
````html
<html>
  <head>
    <script language='javascript' type='text/javascript' src='/MaxTouch.js'></script>
    <script language='javascript' type='text/javascript' src='/My.js'></script>
  </head>
  <body>
    <div id='moveDiv' style='width: 100%; height: 100%;'>
    </div>
  </body>
</html>
````

And My.js:
````js
var moveDiv = docuement.getElementById('moveDiv');

touch.addTouch(moveDiv);

//you could replace moveHorizontal with moveEdgeWest and you only get the Event, if you touch your device from left to right
var isHorizontalMove = false;
moveDiv.moveHorizontal = function(event) {
  console.log('you do a Horizontal move!');
  console.log('with x:' + event.x + ' and y: '+ event.y);
  console.log('your different to the Start (touch/click) point is x:'+event.mX+' and y:'+event.mY);
  
  isHorizontalMove = true;
}
movDiv.moveEdgeWest = function(event) {
  console.log('Damn, you move from left (outside your devise) to right!');
}

moveDiv.touchStop = function(event) {
  if(isHorizontalMove) {
    console.log('You stop the HorizontalMove.');
    isHorizontalMove = false;
  }
}

````
ready.


##All Methodes:


###CompasMoves
| JS Call | Description                           |
|---------|---------------------------------------|
|.moveHorizontal: | Finger/Maus von links nach rechts oder anders rum.|
|   .moveEast: | Finger/Maus von links nach rechts. |
|   .moveWest: | Finger/Maus von rechts nach links. |
|.moveVertical: | Finger/Maus von unten nach oben oder anders rum. |
|   .moveNorth: | Finger/Maus von unten nach oben. |
|   .moveSouth: | Finger/Maus von oben nach unten. |

####Toggle
Toggle means: if the first time is a e.g. HorizontalMove it is alway a HorizontalMoveToggle (not moveVerticalToggle). 

| JS Call | Description                           |
|---------|---------------------------------------|
|.moveHorizontalToggle |   |
|   .moveEastToggle |  |
|   .moveWestToggle |  |
|.moveVerticalToggle |   |
|   .moveNorthToggle |   |
|   .moveSouthToggle |   |
    
###Edge Moves
| JS Call | Description                           |
|---------|---------------------------------------|
|.moveEdgeNorth| Finger/Maus vom Oberen Bidschirmrand. |
|.moveEdgeEast | Finger/Maus vom rechten Bildschirmrand. |
|.moveEdgeSouth | Finger/Maus vom unteren Bidschirmrand. |
|.moveEdgeWest | Finger/Maus vom linken Bildschirmrand. |
  
###Touches
| JS Call | Description                           |
|---------|---------------------------------------|
|.touched | one Touch  |
| .dbltouched | Double Touch |
| .longTouched | Long touch |
  
###End of Every Move
| JS Call | Description                           |
|---------|---------------------------------------|
|.touchStop | The Stop Event from evrery Touch Move |


#Further notes
Developed by Max Julian Hoffmann
