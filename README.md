#MaxTouch.JS


A Javascript Lib for Touch Events.


##Tutorial
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

My.js
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
moveDiv.touchStop = function(event) {
  if(isHorizontalMove) {
    console.log('You stop the HorizontalMove.');
    isHorizontalMove = false;
  }
}

````

##Its possible do use the Methodes:


###CompasMoves
| JS Call | Description                           |
|---------|---------------------------------------|
|moveHorizontal: | wenn der Finger von links nach rechts oder anders rum geht.|
|   moveEast: | wenn der Finger von links nach rechts geht. |
|   moveWest: | wenn der Finger von rechts nach links geht. |
|moveVertical: | wenn der Finger von unten nach oben oder anders rum geht. |
|   moveNorth: | wenn der Finger von unten nach oben geht. |
|   moveSouth: | wenn der Finger von oben nach unten geht. |

####Toggle
Toggle means: if the first time is a e.g. HorizontalMove it is alway a HorizontalMove. 

| JS Call | Description                           |
|---------|---------------------------------------|
|moveHorizontalToggle |   |
|   moveEastToggle |  |
|   moveWestToggle |  |
|moveVerticalToggle |   |
|   moveNorthToggle |   |
|   moveSouthToggle |   |
    
###Edge Moves
| JS Call | Description                           |
|---------|---------------------------------------|
|moveEdgeNorth| |
|moveEdgeEast | |
|moveEdgeSouth | |
|moveEdgeWest | |
  
###Touches
| JS Call | Description                           |
|---------|---------------------------------------|
|touched | one Touch  |
| dbltouched | Double Touch |
| longTouched | Long touch |
  
###End of Every Move
| JS Call | Description                           |
|---------|---------------------------------------|
|touchStop | The Stop Event from evrery Touch Move |


#Further notes
Developed by Max Julian Hoffmann

##TODO:
Rotate
