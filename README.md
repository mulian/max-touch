MaxTouch.JS
==========

A Javascript Lib for Touch Events.


Tutorial
=========
...
var moveDiv = docuement.getElementById('moveDiv');

touch.addTouch(moveDiv);

//you could replace moveHorizontal with moveEdgeWest and you only get the Event, if you touch your device from left to right
moveDiv.moveHorizontal = function(event) {
  console.log('you do a Horizontal move!');
  console.log('with x:' + event.x + ' and y: '+ event.y);
  console.log('your different to the Start (touch/click) point is x:'+event.mX+' and y:'+event.mY);
}
...

Its possible do use the Methodes:
=========

CompasMoves
========
  *moveHorizontal: wenn der Finger von links nach rechts oder anders rum geht.
    *moveEast: wenn der Finger von links nach rechts geht.
    *moveWest: wenn der Finger von rechts nach links geht.
  *moveVertical: wenn der Finger von unten nach oben oder anders rum geht.
    *moveNorth: wenn der Finger von unten nach oben geht.
    *moveSouth: wenn der Finger von oben nach unten geht.
Toggle means: if the first time is a e.g. HorizontalMove it is alway a HorizontalMove.
  *moveHorizontalToggle
    *moveEastToggle
    *moveWestToggle
  *moveVerticalToggle
    *moveNorthToggle
    *moveSouthToggle
    
Edge Moves
========
  *moveEdgeNorth
  *moveEdgeEast
  *moveEdgeSouth
  *moveEdgeWest
  
Touches
========
  *touched
  *dbltouched
  *longTouched
  
End of Every Move
========
  *touchStop
