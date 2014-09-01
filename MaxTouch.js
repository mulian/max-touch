	/*
	 * MaxTouch.js is developed by Max Julian Hoffmann
	 *
	 * License: MIT
	 */

	/*Touch
	 *
	 * TODO: 
	 *   *setGlobalFunction= Eine Function setzen die für alle Touch elemente Gilt, ausser bei dennen die Überschrieben werden.
	 *   *Pinch to Zoom!
	 *      *Rotate
	 *   *Drag And Drop
	 *   *Ausserhalb: User Interface designen... standartfunktionen
	 *
	*/
	function Touch() {
		var t = this;

		var req = new Object();

		this.addTouchStart = function(element,callBackFunction) {
			addTouchEvent('touchstart',element,callBackFunction);
			addTouchEvent('mousedown',element,callBackFunction);
		}

		this.addTouchEnd = function(element,callBackFunction) {
			addTouchEvent('touchend',element,callBackFunction);
			addTouchEvent('mouseup',element,callBackFunction);
		}

		this.addTouchMove = function(element,callBackFunction) {
			addTouchEvent('touchmove',element,callBackFunction);
			addTouchEvent('mousemove',element,callBackFunction);
		}

		var eventFunction = function(element,name,callBackFunction) {
				return function(event) {
					if(!(event.target.tagName=='A') && !(event.target.tagName=='VIDEO')) event.preventDefault();
					callBackFunction(name,event,element);
				};
			};

		function addTouchEvent(name,element,callBackFunction) {
			element.addEventListener(name, eventFunction(element,name,callBackFunction));
		}

		this.addTouch = function(element) {
			t.addTouchStart(element,touchEventStart);
			t.addTouchEnd(element,touchEventStop);
			t.addTouchMove(element,touchEventMove);
		}

		function GetEventInfo() {
			var isMouseEvent = function(event) {
				switch(event.type) {
					case 'mouseup':
					case 'mousemove':
					case 'mousedown': return true; break;
					default: return false;
				}
			}
			this.isMouseEvent = isMouseEvent;

			this.getAnzFingers = function(event) {
				if(isMouseEvent(event)) {
					return 1;
				} else {
					return event.targetTouches.length;
				}
			}
			this.getEventX = function(event) {
				if(isMouseEvent(event)) {
					return event.clientX;
				} else if(event.targetTouches.length>0) {
					return event.targetTouches[0].pageX;
				} else {
					return undefined;
				}
			}
			this.getEventY = function(event) {
				if(isMouseEvent(event)) {
					return event.clientY;
				} else if(event.targetTouches.length>0) {
					return event.targetTouches[0].pageY;
				} else {
					return undefined;
				}
			}
		} var getEventInfo = new GetEventInfo();

		/* CheckAndRun
		 * Es Prüft ob das Element den Namen
		 * Dies Verhindert das Abrechen der Funktion, weil das element nicht vorhanden ist.
		 */
		function checkAndRun(element,name) {
			var args = Array.prototype.slice.call(arguments);
			if(element[name]!=undefined) {
				element[name].apply(null,args.slice(2));
				return true;
			} else return false;
		}

		function SessionRecord() {
			this.maxFinger=0;
			this.isSession=false;
			var t = this;
			function setMax(event) {
				var fingers = getEventInfo.getAnzFingers(event);
				if(t.maxFinger>fingers) 
					t.maxFinger=fingers;
			}
			this.start = function(event) {
				setMax(event);
				this.isSession=true;
			}
			this.move = function(event) {
				setMax(event);
			}
			this.stop = function(event) {
				if(getEventInfo.getAnzFingers(event)==0) {
					t.isSession=false;
					t.maxFinger=0;
				}
			}
		}
		var sessionRecord = new SessionRecord();

		/*
		 * CheckTouched
		 * Prüft ob ein Touch ein normaler Touched (touched), DoppelTouched (dblTouched) oder ein LongTouched (longTouched) ist.
		 * Das ereignis wird jeweils an das Element gehangen. Desweiteren wird mitgegeben wieviele Finger maximal im spiel waren.
		 * 
		 * touched: Ein kurzer touch (finger drauf -> innerhalb von 0,400s wieder weg) (n-finger möglich)
		 * dblTouched: Zwei kurzer touchs (finger drauf -> finger weg -> finger drauf -> finger weg; innerhalb von 0,400s) (n-finger möglich)
		 * longTouched: Finger wurde ganz lange drauf gehalten.
		 */
		function CheckTouched() {
			var isUnderAHalfsec=null,
				timeOut = null,
				sessionCount = 0,
				tCT=this,
				longTouch=0,
				fingers=0; //Die max. Anzahl der Finger pro kompletten Event

			function maxFingers(count) {
				if(fingers<count) fingers=count;
				//info(fingers);
			}

			this.isSession=false;

			this.start = function(event,element) {
				maxFingers(getEventInfo.getAnzFingers(event));
				
				if(timeOut==null)
					timeOut = setTimeout(function() {
						if(sessionCount==0) {
							longTouch=fingers;
						} else if(sessionCount==1) {
							startMethode(element,event,'touched',fingers);
						} else if(sessionCount>=2) {
							startMethode(element,event,'dbltouched',fingers);
						}

						fingers=0;
						sessionCount=0;
						timeOut=null;
					},400);

				tCT.isSession=true;
			}

			this.stop = function(element,event) {
				if(!getEventInfo.isMouseEvent) tCT.isSession = getEventInfo.getAnzFingers(event)==0?false:true;
				else tCT.isSession = false;
				
				if(longTouch>0) {
					startMethode(element,event,'longTouched',longTouch);
					longTouch=0;
				} 
				if(!tCT.isSession) sessionCount++;
			}

			function startMethode(element,event,name,fingers) {
				checkAndRun(element,name,
								event,fingers); //zusätzliche
				element=null;
			}
		} var checkTouched = new CheckTouched();

		/* CompasMoves
		 * Es wird festgestellt in welcher Himmelsrichtung der Finger bewegt wird und das entsprechende ereignis wird getriggert.
		 * WICHTIG: Es wird immer von dem Startpunkt des fingers ausgegangen!
		 *
		 * *moveHorizontal: wenn der Finger von links nach rechts oder anders rum geht.
		 *   *moveEast: wenn der Finger von links nach rechts geht.
		 *   *moveWest: wenn der Finger von rechts nach links geht.
		 * *moveVertical: wenn der Finger von unten nach oben oder anders rum geht.
		 *   *moveNorth: wenn der Finger von unten nach oben geht.
		 *   *moveSouth: wenn der Finger von oben nach unten geht.
		 *
		 * All diese Möglichkeiten gibt es auch als 'einrast funktion'(toogle), wenn das erste Ereignis z.B. moveHorizontalToggle
		 *   wird während der 'Session' kein moveVerticalToggle aufgerufen.
		 * Des weiteren ist unabhängig von moveHorizontalToggle und moveVerticalToggle die Himmelsrichtungen. Diese Rasten genauso 
		 *   ein (nur mit dem zusatz Toggle). Also falls moveNorthToggle das erste mal ausgeführt wurde, wird während der Session
		 *   kein anderes Event aufgerufen (andere Events in dem Fall: moveWestToggle,moveEastToggle,moveSouthToggle)
		 * Hier die weiteren Events:


		 */
		function CompasMoves() {
			var startMoveX = null,
				startMoveY=null,
				isFirstMoveLevel1=null,
				isFirstMoveLevel2=null,
				windowWidth=0, //TODO:Anpassen auf relative breite
				windowHeight=0;

			var mouseEventStart=false;
			this.start = function(event) {
				startMoveX=getEventInfo.getEventX(event);
				startMoveY=getEventInfo.getEventY(event);

				windowWidth=window.innerWidth;
				windowHeight=window.innerHeight;
				if(getEventInfo.isMouseEvent(event)) mouseEventStart=true;
			}
			/*
			function isBetween(kind,element,maxEdge) {
				switch(kind) {
					case MoveKind.moveEdgeWest: if(element.offsetLeft>=0 && element.offsetLeft<=maxEdge) return true;
						break;
					case MoveKind.moveEdgeEast: if(element.offsetRight<=windowWidth && element.offsetRight>=maxEdge) return true;
						break;
				}
			}
			*/
			this.move = function(event,element) {
				if((!getEventInfo.isMouseEvent(event)) || mouseEventStart) {
					var moveX=getEventInfo.getEventX(event);
					var moveY=getEventInfo.getEventY(event);

					var movementX = moveX-startMoveX;
					var movementY = moveY-startMoveY;

					var max = 5;
					var maxEdge=10;

					if((movementX>max || movementX<(max*-1))) {
						checkAndRunPlusToggle(element,'Horizontal',event,movementX);

						//Himmelsrichtungen
						if(movementX>0) {
							checkAndRunPlusToggle(element,'East',event,movementX);
						} else if(movementX<0) {
							checkAndRunPlusToggle(element,'West',event,movementX);
						}
					}
					if((movementY>max || movementY<(max*-1))) {
						checkAndRunPlusToggle(element,'Vertical',event,movementX);

						//Himmelsrichtungen
						if(movementY>0) {
							checkAndRunPlusToggle(element,'South',event,movementX);
						} else if(movementY<0) {
							checkAndRunPlusToggle(element,'North',event,movementX);
						}
					}
				}
			}
			this.stop = function() {
				if(getEventInfo.isMouseEvent(event)) mouseEventStart=false;
				MoveKind.resetIt();
				isFirstMoveLevel1=null;
				isFirstMoveLevel2=null;
			}

			/* CheckAndRunPlusTooggle
			 * Es startet CheckAndRun für den Namen und Prüft mittels MoveKind ob es das 
			 * erste bei diesen Move ist, falls ja wird dies mit dem zusatz Toggle auch aufgerufen.
			 */
			function checkAndRunPlusToggle(element,name,event,movement) { //Man könnte die Parameter veringern, sind die Probleme aber verkraftbar?
				var args = Array.prototype.slice.call(arguments);
				checkAndRun(element,'move'+name,event,movement);
				if(MoveKind.setMove(MoveKind['move'+name]))
					checkAndRun(element,'move'+name+'Toggle',event,movement);
			}

			var MoveKind = {
				moveHorizontal : 0,
				moveEast : 11,
				moveWest : 12,

				moveVertical : 5,
				moveNorth : 16,
				moveSouth : 17,

				moveEdgeNorth : 6,
				moveEdgeEast : 1,
				moveEdgeSouth : 7,
				moveEdgeWest : 2,

				moveUnder10: null,
				moveUnder20: null,
				setMove : function(kind) {
					var isOkBool = false;
					if(kind>=0 && kind<10) {
						if(this.moveUnder10==kind || this.moveUnder10==null) {
							isOkBool = true;
							this.moveUnder10 = kind;
						}
					} else if(kind>=10 && kind <20) {
						if(this.moveUnder20==null || this.moveUnder20==kind) {
							isOkBool = true;
							this.moveUnder20 = kind;
						}
					}
					return isOkBool;
				},
				resetIt : function() {
					this.moveUnder10=null;
					this.moveUnder20=null;
				}
			}
		} var compasMoves = new CompasMoves();

		function Edge() {
 			var possebillitys = new Object(),
 				maxEdge=20,
 				check=null;

			function ElementPossibilitys(element) {
				var offsetRigth = element.offsetLeft+element.offsetWidth;

				if(element.offsetLeft==0) this.west = true;
				else this.west = false;

				if(offsetRigth==window.innerWidth) this.east = true;
				else this.east = false;

				if(element.offsetTop==0) this.north = true;
				else this.north=false;

				if(element.offsetBottom==window.innerHeight) this.south = true;
				else this.south=false;

				this.check = function(x,y) {
					if(this.west && isBetween(0,x,maxEdge)) return 'moveEdgeWest';
					else if(this.east && isBetween(window.innerWidth-maxEdge,x,window.innerWidth)) return 'moveEdgeEast';
					else if(this.north && isBetween(0,y,maxEdge)) return 'moveEdgeNorth';
					else if(this.south && isBetween(window.innerHeight-maxEdge,y,window.innerHeight)) return 'moveEdgeSouth';
					else return null;
				}
				function isBetween(p1,p2,p3) {
					if(p1<=p2 && p2<=p3) return true;
					else return false;
				}
 			}

			this.start = function(element,event) {
				if(possebillitys[element]==undefined) possebillitys[element] = new ElementPossibilitys(element);
				check=possebillitys[element].check(getEventInfo.getEventX(event),getEventInfo.getEventY(event));
			}

			this.move = function(element,event) {
				if(check!=null) {
					checkAndRun(element,check,event);
				}
			}

			this.stop = function(element,event) {
				if(getEventInfo.getAnzFingers(event)==0 && check!=null) {
					checkAndRun(element,'moveEdgeErase',event);
					
					check=null;
				}
			}
		} var edge = new Edge();


		var startMoveX=null, startMoveY = null;
		var lastX=null, lastY=null;
		var move=false;
		function touchEventStart(eventName,event,element) {
			move=true;
			startMoveX = getEventInfo.getEventX(event);
			startMoveY = getEventInfo.getEventY(event);

			sessionRecord.start(event);
			edge.start(element,event);
			checkTouched.start(event,element);
			compasMoves.start(event);
			checkAndRun(element,'touchStart',event);

		};
		function touchEventStop(eventName,event,element) {
			addMoveInfoToEvent(event,true);

			edge.stop(element,event);
			checkTouched.stop(element,event);
			compasMoves.stop();
			sessionRecord.stop(event);

			checkAndRun(element,'touchStop',event);
		};

		/*
		 * Das event Object wird angereichert mit x und y angaben sowie movementX (mX) und movementY (mY).
		 * Movement bedeutet: x minus (x beim start des clicks/touches).
		 *
		 */
		var addMoveInfoToEvent = function(event,moveEnd) {
			var moveX=getEventInfo.getEventX(event);
			var moveY=getEventInfo.getEventY(event);
			if(moveX==undefined && moveY==undefined) {
				moveX=lastX;
				moveY=lastY;
			}

			event.x = moveX; event.y = moveY;

			var movementX = moveX-startMoveX;
			
			var movementY = moveY-startMoveY;
			event.mX = movementX; event.mY = movementY;

			lastX=moveX; lastY=moveY;
			
			if(moveEnd) {
				move=false; startMoveX=null; startMoveY = null; lastX=null; lastY=null;
			}
		}

		function touchEventMove(eventName,event,element) {
			if(move) {
				addMoveInfoToEvent(event);

				sessionRecord.move(event);
				edge.move(element,event);
				compasMoves.move(event,element);
				checkAndRun(element,'touchMove',event);
			}
		}
	}
	var touch = new Touch();
