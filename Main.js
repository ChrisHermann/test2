// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;

var percent = 1;

Paused = false;
var MMusic = false;
var MSound = false;
//counter for resume button
var inputcounter = 0;

//Global function that applies a function to all cards.
//We avoid $("#Card").each because it's very slow in ie8.
function ForEachCard(Function)
{
	for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
	{
		Function.apply($("#Card_"+i)[0]);
	}
}

//Similar, but with all GFX cards.
function ForEachGFX(Function)
{
	for (var i = 0; i < GFXCount; ++i)
	{
		if ($("#GFX_"+i)[0])
		Function.apply($("#GFX_"+i)[0]);
	}
}

function ResumeGame()
{
	if(GameStart)
	{
		Then = new Date().getTime();
		$.playground().resumeGame();	
		soundBG.resume();
		Paused = false;
		$("#ResumeBut").remove();
		inputcounter = 0;
	}
}
function PauseGame()
{
	
	if(GameStart)
	{
		$.playground().pauseGame();
		soundBG.pause();
		Paused = true;
		
		if(inputcounter <1)
		{
			$("#playground").append("<div id='ResumeBut'style='color: white; position: absolute; left: 0px; top: 0px;'></div>");
			//$("#playground").append("<button id='ResumeBut' type='button' style='color: white; position: absolute; left: 10px; top: 120px;'>Click Me!</button>");
			inputcounter++;
			
	
			myButton = document.createElement("input");
			myButton.type = "button";
			myButton.value = "Resume Game";
			myButton.id = "ButRG";
			Current = $(myButton);
			Current.css('font-family','Helvetica Neue, Helvetica Arial, sans-serif');
			Current.css('font-size','21px');
			Current.css('font-weight','bold');
			Current.css('text-decoration','none');
			Current.css('color','#402a20');
			Current.css('background-color','#eab344');
			Current.css('height','48px');
			Current.css('width','200px');
			Current.css('text-align:center');
			Current.css('display','block');
			Current.css('border-style','solid');
			Current.css('border-width','4px');
			Current.css('border-color','#402a20');
			Current.css('border-radius','48px');
			myButton.onmouseover = function() {
			$(this).css('background-color','#ffd258');
			};
			myButton.onmouseout = function() {
			$(this).css('background-color','#eab344');
			};
			myButton.onclick = ResumeGame;
			placeHolder = document.getElementById("ResumeBut");
			placeHolder.appendChild(myButton);
			
			
			$("#ResumeBut").css('left', (PLAYGROUND_WIDTH/2-$("#ButRG").width()/2)+'px')
			$("#ResumeBut").css('top',( PLAYGROUND_HEIGHT/2-$("#ButRG").height()/2)+'px')
		}
	}
}

function PauseResume()
{
	
		if (Paused == false)
			PauseGame();
		else
			ResumeGame();
}

function ResumeScreen()
{
	ResumeGame();
}

function MuteMusic()
{
	function MuteMusic()
	{
		soundBG.setMute(true);
		MMusic = true;
	}
	function UnMuteMusic()
	{
		soundBG.setMute(false);
		MMusic = false;
	}
	
	if(MMusic == false)
		MuteMusic();
	else
		UnMuteMusic();
}

function MuteSound()
{
	function MuteSound()
	{
		soundFlipCard.setMute(true);
		MSound = true;
	}
	function UnMuteSound()
	{
		soundFlipCard.setMute(false);
		MSound = false;
	}
	
	if(MSound == false)
		MuteSound();
	else
		UnMuteSound();
}




// --------------------------------------------------------------------
// --                      the main declaration:                     --
// --------------------------------------------------------------------

//This game uses gamequery. The documentation for this can be found at:
//http://gamequeryjs.com/documentation/
//It is purely made in the DOM and as such does not use canvas at all.

 $(function(){
	document.body.style.overflow = "hidden";
	//Calculate playground width and height:
	PLAYGROUND_WIDTH = $(window).width();
	PLAYGROUND_HEIGHT = $(window).height();
	var UISIZEY = 170;
 
	//$("#HighscoreHUD")
	//Custom sorting function, so the array knows to sort based on an attribute.
	function CustomSort(a,b)
	{
		return(b.score-a.score);
	}
	
	//TEST HIGHSCORE
	//TODO: DELETE!!!
	

	//Calculate playground width and height:
	PLAYGROUND_WIDTH = $(window).width() - 20;
	PLAYGROUND_HEIGHT = $(window).height() - 20;
	
	$("#spin").css('left', PLAYGROUND_WIDTH/2+'px')
	$("#spin").css('top', (PLAYGROUND_HEIGHT/2-120)+'px')
	

	

	//Calculate Layour for responsive Design.
	//Calculate Area:
	var CARDSIZEX = 208;
	var CARDSIZEY = 208;
	var BGSIZE = {x: 2362, y: 1403};
	var EMPTYSPACE = 5;
	var DoneTimer = 0;
	var Done = false;
	var Ended = 0;
	var EndedL = 0;
	var Name = "";
	var Line;
	var Scores;
	GFXCount = 0;
	Points = 0;
	PointsV = 0;
	Autocomplete = false;
	Restarted = false;

	Now = 0;
	
	Delta = 0;
	
	Then = new Date().getTime();
	
	var CoreGameTime = 50 * 1000;
	
	var CurGameTime = CoreGameTime;
	
	GameStart = false;
	
	
	var LastA=false;
	var LastP=false;
	var LastO=false;
	

	//Cahnge this if image resolution changes
	var CardSize = {x: 208,y: 303};

	CoreLevel = 0;
	
	CurLevel = CoreLevel;
	
	
    // Animations declaration: 
    // The background:    
	
	var DM = new DeckManager();
	IM = new ImageManager();
	LM = new LevelManager();
	
	
	IM.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
	
	
		
	//Sounds
	 soundBG = createjs.Sound.createInstance("./music.mp3");
	 soundFlipCard = createjs.Sound.createInstance("./flipcard.wav");

	 
	//Loads the normal card faces
	var Face = new Array();
	IM.LoadCard("peter.png");
	IM.LoadCard("nicolaus.png");
	IM.LoadCard("schwartz.png");
	IM.LoadCard("http://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cards-10-Diamond.svg/343px-Cards-10-Diamond.svg.png");
	IM.LoadCard("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cards-9-Heart.svg/428px-Cards-9-Heart.svg.png");
	IM.LoadCard("http://allaboutcards.files.wordpress.com/2009/07/bp-frogace.jpg");
	IM.LoadCard("http://weandthecolor.com/wp-content/uploads/2013/02/8-Hearts-Playing-Card-Illustration-by-Jonathan-Burton.jpg");
	IM.LoadCard("http://photos.pokerplayer.co.uk/images/front_picture_library_UK/dir_1/total_gambler_916_15.jpg");
	IM.LoadCard("http://1.bp.blogspot.com/-wdHxCm6bFwE/TxBc-jVD1aI/AAAAAAAAEH0/CG6PIcG69H8/s1600/card6.png");
	IM.LoadCard("http://weandthecolor.com/wp-content/uploads/2013/02/5-Clubs-Playing-Card-Illustration-by-Jonathan-Burton.jpg");
	
	
	LM.Create(IM.Faces.length,25);
	
	//Loads the bonus card faces. The ID's of these are important, as they needs to be used in Card.RunBonus();
	SWARTZID = IM.LoadCard("http://www.towergaming.com/images/media-room/articles/joker-card.png");
	POINTID = IM.LoadCard("http://static8.depositphotos.com/1035986/841/v/950/depositphotos_8416424-Joker-Clown-playing-cards-hubcap-focus-trick-circus-fun-lough.jpg");
	PAIRID = IM.LoadCard("http://www.bjwebart.com/qtr-fold_card_images/4_card_front_placed.jpg");
	CONFUSEID = IM.LoadCard("http://www.usgreencardoffice.com/uploads/images/usgco_liberty.jpg");
	
	POINTS1 = IM.LoadMisc("http://starship-games.com/500.png");
	POINTS2 = IM.LoadMisc("http://starship-games.com/500.png");
	
	//Change this and lines: 636-681, to change the UI.
	var BackI = IM.LoadMisc("./BG.jpg");
		
	//Sets the amountn of bonus cards loaded.
	BONUSES = 4;	
	
	
	//focus unfocus
	window.addEventListener("focus", function(event) 
	{ 
		ResumeGame();
	}, false);
	window.addEventListener("blur", function(event)
	{ 
		PauseGame();
	}, false);
    

	//This functions "creates a level" this function is run when there is an empty screen to set up
	//everything for the next level.
	function CreateLevel()
	{
		//First go to next level to increase the difficulty.
		LM.NextLevel();
		
		// Resets clock.
		Then = new Date().getTime();
		CurGameTime = CoreGameTime;
		
		// Level goes up or Restarts
		if(Restarted == false)
		{
		CurLevel++;
		}
		else
		{
		CurLevel = 1;
		}
		
		
		current = $("#LevelHUD");
		current.html("Level: "+CurLevel);
		
		Resized();
		
		//Setup Card data so they can be reached randomly
		var Vals = new Array();
		var Vals2 = new Array();
		Turned = 0;
		var TurnedMax = 2;
		
		//This will ensure that two cards of each are added to the deck
		//This will then be fed to the Deckmanager.
		for (var i = 0; i < LM.NumberOfCards; ++i)
		{
			Vals[i] = Math.floor(i/2);
		};
		
		
		//This will ensure that bonus cards are added to the stage.
		//This will then be fed to the Deckmanager.
		for (var i = 0; i < LM.NumberOfCardsBonus; ++i)
		{
			Vals2[i] = DM.GetRandomBonus();
		};
		
		
		
		DM.Create(Vals, Vals2);
		
		//In this stage we spawn the actual cards, right now this is a huge function.
		//Imagemanager and deckmanager will make this function a lot smaller.
		for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
		{
			//Generate unique ID for the card
			var name = "Card_"+i;
			
			val = DM.PushCard();
				
			//Add the actual card to the playground, we spawn them in a responsive awy based on the resolution of the game.
			$("#Cards").addSprite(name, {animation: IM.GetBack(), width: CardSize.x, height: CardSize.y, posx: (i%(Math.ceil(noc))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (LM.NumberOfCards + LM.NumberOfCardsBonus) - ((LM.NumberOfCards + LM.NumberOfCardsBonus)%(Math.ceil(noc))) ) , posy: Math.floor( i / (Math.ceil(noc))  ) * SpaceY + SpaceY - 152 });
			
			//Create the actual class for the card, this will add logic to the object.
			var Current = $("#"+name)[0];
			Current.Cards = new Cards($("#"+name));
			Current.Cards.Create(val, IM.GetCard(val), IM.GetCard(SWARTZID), IM.GetBack(), DM.LastBonus(), Scale);
			
			
			//Add a mousedown event for the card, this mousedown will be run in the main
			//environment rather than the class environment to make sure that we have access
			//to all the data we need access to.
			$("#"+name).mousedown(function(e)
			{
				var Ready = 0;
				ForEachCard(function()
				{
					if (this.Cards.visible && (this.Cards.Turning==true || this.Cards.FlippedV==true))
					{
						Ready++;
					}
				});
				//Find all the objects with the tag/class card.
				//Check if the mouse clicked the card, if it's still part of the game, and if it has not been flipped.
					
				
				if (this.Cards.visible==true && this.Cards.Flipped == false  && this.Cards.Turning == false
				&& Ready<TurnedMax && !Done)
				{
					//Run the clicked event for the card, this will start events etc.
					this.Cards.Clicked();
					//Increase the turned counter, if we have turned the correct amount of cards to be compared
					//then compare them.
					if (this.Cards.Bonus == false)
					{
						Turned++;
						if (Autocomplete)
						{
							Autocomplete = false;
							var Card = this.Cards;
							
							var Someflip=false;
							ForEachCard(function()
							{
								if (this.Cards.Flipped==false && Someflip==false && this.Cards.value == Card.value)
								{
									this.Cards.node.mousedown();
									Someflip = true;
								}
							});
						}
						else
						if (Turned==TurnedMax)
						{
							//We have turned the amount of cards needed
							//Find out which value the first card has, and use this as a base to compare if cards match.
							//Also instantiate a counter for the amount of cards actually matching.
							//It's done this way if you want a variable number of cards needed for a match.
							var Correct = this.Cards.value;
							var CorrectAmount = 0;
							ForEachCard(function()
							{
								//For each card, if they are flipped, are not going into hiding/deletion, and has the
								//Correct value, increase the counter for the number of cards matching.
								if (this.Cards.Flipped == true && this.Cards.Hiding==0 && this.Cards.value == Correct)
									CorrectAmount++;
								
							});
							
							//If we have a correct match
							if (CorrectAmount==TurnedMax)
							{
								ForEachCard(function()
								{
									//Foreach card that is flipped and not in hiding, delete them (aka. yay, you got a match).
									if (this.Cards.Flipped==true && this.Cards.Hiding==0)
									{
										//This is per card in the matched stack.
										if (this.Cards.Bonus == false)
										Points+=100;
										this.Cards.SetVisible(false);
									}
								});
							}
							
							ForEachCard(function()
							{
								//Foreach card that was not in hiding and was not part of the match, unflip them again.
								if (this.Cards.Flipped==true && this.Cards.Hiding==0)
								this.Cards.Hide();
							});
							
							Turned=0;
						}
					}
				}
			});
								 
		}
	}
	
	
	
	var resizeTimer;

    //Event to handle resizing
	//This event should fire under any circimstance, except when safari is NOT maximized, and windows resolution is changed (WTF?)
    $(window).resize(function () 
    {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(Resized, 1);
    });
	
	
	
    //Actual Resizing Event
    function Resized() 
    {	
		//Calculate playground width and height:
		PLAYGROUND_WIDTH = $(window).width();
		PLAYGROUND_HEIGHT = $(window).height();
		
		//Calculates the screen ratio, so we can organize the deck in a manner that makes sense to the ratio.
		Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
		Ratio =  (Ratio+1)/2;
		
		//Gets the square root of the number of cards. This is because we would attempt to make a square, should the
		//ratio be 1:1
		noc = Math.sqrt(LM.NumberOfCards + LM.NumberOfCardsBonus);
		
		//Calculates how much space there needs to be in between each card to make a proper layout.
		//It will add to extra empty rows, to make room for UI.
		//Calulate number of rows based on ratio.
		SpaceY = PLAYGROUND_HEIGHT/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    )  + 1));
		
		//Now recalulate noc, so it will make a more even distribution of the cards, based on the amount of rows it has.
		noc = (LM.NumberOfCards + LM.NumberOfCardsBonus)/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    ) ));
		
		//Calculate the number of columns based on the new even distribution.
		
		SpaceX = PLAYGROUND_WIDTH/ Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1));
		
		
		LastYOff = 0;
		
		//If there is an uneven amount of cards at the last column, it will calculate the offset to center that column
		//Specifically
		if (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) !=  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))
		{
			LastYOff = (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) -  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))/2 * SpaceX;
		}
		
		//Now, if check if the calculated spacing on X is large enough so that hte card can be drawn, if not, calculate
		//How much the card needs to be scaled down.
		if (SpaceX >= CARDSIZEX+EMPTYSPACE)
		{
			Scale1 = 1;
		}
		else
		{
			Scale1 = SpaceX/(CARDSIZEX+EMPTYSPACE);
		}
		
		//Do the same for Y
		if (SpaceY >= CARDSIZEY+EMPTYSPACE)
		{
			Scale2 = 1;
		}
		else
		{
			Scale2 = SpaceY/(CARDSIZEY+EMPTYSPACE);
		}
		
		//Now choose the lesser of the scalings, because this one will be the one to actually be applied.
		Scale = Math.min(Scale1, Scale2);
		
		
		//Set the width and height of the div.
		$("#playground").playground({
        height: PLAYGROUND_HEIGHT, 
        width: PLAYGROUND_WIDTH});
		
		
	
	
		//Could possibly use foreachcard, it's hard to handle uninitialized variables in foreachcard though.
		//Finds all cards, if they exist, updates their position and scaling. 
		for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
		{
			var Card = $("#Card_"+i)
			
			if (Card.length>0)
			{
				Card[0].Cards.scale = Scale;
				Card[0].Cards.Update({posx: (i%(Math.ceil(noc))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (LM.NumberOfCards + LM.NumberOfCardsBonus) - ((LM.NumberOfCards + LM.NumberOfCardsBonus)%(Math.ceil(noc))) ) , posy: Math.floor( i / (Math.ceil(noc))  ) * SpaceY + SpaceY - 152 });
		   }
		
		}
		
		var ScaleUI = Math.min((SpaceY - 10  - (CARDSIZEY+EMPTYSPACE)/2*Scale)/(UISIZEY + 10), 1);
		var TScale = Math.min(Math.floor((PLAYGROUND_WIDTH-20)/4)/Math.max($('#PointHUD').width(),$('#TimeHUD').width(),$('#MuteSBut').width()), ScaleUI);
		
		$("#BorderTop").width(PLAYGROUND_WIDTH-20);
		
		$("#BorderTop").height(Math.floor(UISIZEY*ScaleUI));
		
		
		
		ButSpace=Math.floor(PLAYGROUND_WIDTH-20)/3;
		//Math improvements needed!
		current = $('#ButP');
		current.width(320*ScaleUI);
		current.height(88*ScaleUI);
		current.css('font-size', 40*ScaleUI+'px');
		current = $('#PauseBut');
		current.css({ left: Math.floor((ButSpace+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10+Math.floor(70 * ScaleUI)});
		
		current = $('#ButMM');
		current.width(320*ScaleUI);
		current.height(88*ScaleUI);
		current.css('font-size', 40*ScaleUI+'px');
		current = $('#MuteMBut');
		current.css({ left: Math.floor((ButSpace*2+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10+Math.floor(70 * ScaleUI)});
		
		current = $('#ButMS');
		current.width(320*ScaleUI);
		current.height(88*ScaleUI);
		current.css('font-size', 40*ScaleUI+'px');
		current = $('#MuteSBut');
		current.css({ left: Math.floor(((PLAYGROUND_WIDTH-20)+10)-Math.floor(current.width()/2) - ButSpace/2), top: 10+Math.floor(70 * ScaleUI)});
		
		//$('#startbutton').css({ left: Math.floor(10 * ScaleUI ), top: Math.floor(100 * ScaleUI)});
		$("#startbutton").css('left', (PLAYGROUND_WIDTH/2-$("#ButSG").width()/2)+'px');
		$("#startbutton").css('top', (PLAYGROUND_HEIGHT/2-$("#ButSG").height()/2)+'px');
		$('#ButSG').width(160*ScaleUI);
		$('#ButSG').height(44*ScaleUI);
		$('#ButSG').css('font-size', 21*ScaleUI+'px');
		
		current = $('#PointHUD');
		current.css("font-size", Math.floor(220* TScale)+'%');
		current.css({ left: Math.floor((ButSpace*3+10)-Math.floor(current.width()/2)- ButSpace/2) , top: 10});
		
		current = $("#TimeHUD");
		current.css("font-size", Math.floor(220* TScale)+'%');
		current.css({ left: Math.floor((ButSpace*2+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
		
		current = $("#LevelHUD");
		current.css("font-size", Math.floor(220* TScale)+'%');
		current.css({ left: Math.floor((ButSpace+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
		
		
		if ($("#HighscoreHUD"))
		{
			Current = $("#HighscoreHUD");
			
			scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
			
			Current.width(PLAYGROUND_WIDTH);
			Current.css('font-size',Scale*200+'%');
		}
		
		
		scale = Math.max(PLAYGROUND_WIDTH/BGSIZE.x, PLAYGROUND_HEIGHT/BGSIZE.y);
		$("#BG").scale(scale);
		$("#BG").xy(BGSIZE.x*(scale-1)/2 - (BGSIZE.x*scale - PLAYGROUND_WIDTH)/2,(BGSIZE.y*(scale-1))/2  - (BGSIZE.y*scale - PLAYGROUND_HEIGHT)/2);

    };
	
	//Function to end the game
	function EndGame()
	{
		//Correct the variables, and create a div to store the screen to enter your name.
		Ended = 1;
		Name = "";
		$("#overlay").append("<div id='HighscoreHUD'style='color: white; text-align: center; position: absolute; left: 0px; font-family: verdana, sans-serif; font-size: 200%;'></div>");
		
		
		//Generate a string based on the name varaible, which is changed in onkeypress
		var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
		
		var Current = $("#HighscoreHUD");
		//Apply the string to the div, and recenter it.
		Current.html(string);
			
		scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
		

		Current.width(PLAYGROUND_WIDTH);
		Current.css('font-size',Scale*200+'%');
	
		//Delete all cards currently on the field.
		for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
		{
			$("#Card_"+i).remove();
		}
	}
	
	//Remove the highscore screen, and start the game from scratch.
	function RestartGame()
	{
		$("#HighscoreHUD").remove();
		
		
		Scores = new Array();
		
		//Create a line containing the 10 best scores, and apply them to the div.
		$.get('http://www.starship-games.com/GetHighscore.php', {} , function(data) {
			for (i=0; i<data.length/2; i++)
			{
				Scores[i] = {score: data[i*2+1], name: data[i*2]};
			}
		}, 'json');
		
		Scores.sort(CustomSort);
		
		Points = 0;
		PointsV = 0;
		Ended = 0;
		CurGameTime = CoreGameTime;
		//This is the easiest way to reset the levelmanager.
		LM.Create(IM.Faces.length*2,25);
		CreateLevel();
	}
	
	//Used only when entering your name for the highscore.
	document.onkeypress = function(event)
	{
		var key_press = String.fromCharCode(event.keyCode);
		
		if (event.keyCode!=13 && key_press != " " && EndedL==1)
		Name += key_press;
	}
	
	//Used for highscore screens in general.
	$(document).keydown(function (e) {
		//Delete chars when entering name
	    if (e.which === 8)
	    {
			//your custom action here
		
			Name = Name.substring(0, Name.length - 1);
			return false;
 	    }
		//Press enter to go to next screen.
		if (event.keyCode==13)
		{
			if (Ended == 1)
			{
				//If we are entering our name show the highscore
				$("#HighscoreHUD").remove();
				
				//Consider loading this earlier, possibly when starting the game, and than manually inserting the player score
				//both off.line and online.
				
				ShowHighscore();
			}
			else
			if (Ended == 2)
			{
			//Else, restart the game.
				Restarted = true;
				RestartGame();
			}
			
			//Send the highscore to the database.
			ApplyHighscore( {name: Name, score: Points} );
			
			return false;
		}
	});
	
	function ShowHighscore()
	{
		if (Ended!=1)
		{
			//If we were not send from name entering screen, delete all objects first
			//Delete all cards currently on the field.
			for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
			{
				$("#Card_"+i).remove();
			}
		}
		Ended=2;
		
		Line = "<br>";
		
		
		//Create a line containing the 10 best scores, and apply them to the div.
		$.get('http://www.starship-games.com/GetHighscore.php', {} , function(data) {
			for (i=0; i<Math.min(10, Scores.length); i++)
			{
				Line+=(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"<br>";
			}
		}, 'json');
		
		var Current = $("#HighscoreHUD");
		Current.html(Line+"<br>Tryk Enter for at starte et nyt spil");
		
		
		
		scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
		
		Current.width(PLAYGROUND_WIDTH);
		Current.css('font-size',Scale*200+'%');
		
		//Create new div for high score.
		$("#overlay").append("<div id='HighscoreHUD'style='color: white; text-align: center; position: absolute; left: 0px; font-family: verdana, sans-serif; font-size: 200%;'></div>");							 
		$.ajax
		({
			data: "Name=" + Name + "&Score=" + Points,
			type: "POST",
			url: "http://www.starship-games.com/PostHighscore.php",
			complete: function (data) {
			}
		});
	}
	
	//This is called with an object containing name and score, can be used to send to the database.
	function ApplyHighscore(object)
	{
		Scores[Scores.length] = object;
		Scores.sort(CustomSort);
	}
	
	
    // Initialize the game:
    $("#playground").playground({
        height: PLAYGROUND_HEIGHT, 
        width: PLAYGROUND_WIDTH, 
        keyTracker: true,
		mouseTracker: true});

    // Initialize the background
    $.playground()
        .addGroup("background", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT});
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
		.addGroup("GFXG", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
		.addGroup("overlay", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
	//Setup UI
	//Add borders.
	//TODO: Remove background code!!
	$("#background").addSprite("BG", {animation: IM.GetMisc(BackI), width: BGSIZE.x, height: BGSIZE.y});
	
	$("#overlay").append("<div id='BorderTop'style='background: #D27928; border-radius: 14px; position: absolute; left: 10px; top: 10px; height: 59px'></div>");
	
	//Create a div for the Point UI.
	$("#overlay").append("<div id='PointHUD'style='color: white; position: absolute; left: 400px; top: 10px; font-family: verdana, sans-serif; font-weight: bold; font-size:150%;'></div>");
	
	$("#overlay").append("<div id='TimeHUD'style='color: white; position: absolute; left: 200px; top: 10px; font-family: verdana, sans-serif; float: right; font-weight: bold; font-size:150%;'></div>");
	
	$("#overlay").append("<div id='LevelHUD'style='color: white; position: absolute; left: 10px; top: 10px; font-family: verdana, sans-serif; font-weight: bold; font-size:150%;'></div>");
	//Create a div for the Level UI.
	
	//Add div for control buttons
	$("#overlay").append("<div id='PauseBut'style='color: white; position: absolute; left: 10px; top: 120px;'></div>");
	$("#overlay").append("<div id='MuteMBut'style='color: white; position: absolute; left: 100px; top: 70px;'></div>");
	$("#overlay").append("<div id='MuteSBut'style='color: white; position: absolute; left: 10px; top: 70px;'></div>");

	
	//Add the control buttons to the UI
	myButton = document.createElement("input");
	myButton.type = "button";
	myButton.value = "Pause";
	myButton.id = "ButP";
	Current = $(myButton);
	Current.css('font-family','Helvetica Neue,Helvetica Arial,sans-serif');
	Current.css('font-size','21px');
	Current.css('font-weight','bold');
	Current.css('text-decoration','none');
	Current.css('color','#402a20');
	Current.css('background-color','#eab344');
	Current.css('height','48px');
	Current.css('width','200px');
	Current.css('text-align:center');
	Current.css('display','block');
 	Current.css('border-style','solid');
	Current.css('border-width','4px');
	Current.css('border-color','#402a20');
	Current.css('border-radius','48px');
	myButton.onmouseover = function() {
	$(this).css('background-color','#ffd258');
	};
	myButton.onmouseout = function() {
	$(this).css('background-color','#eab344');
	};
	myButton.onclick = PauseGame;
	placeHolder = document.getElementById("PauseBut");
	placeHolder.appendChild(myButton);
	
	
	myButton = document.createElement("input");
	myButton.type = "button";
	myButton.value = "Mute Music";
	myButton.id = "ButMM";
	Current = $(myButton);
	Current.css('font-family','Helvetica Neue,Helvetica Arial,sans-serif');
	Current.css('font-size','21px');
	Current.css('font-weight','bold');
	Current.css('text-decoration','none');
	Current.css('color','#402a20');
	Current.css('background-color','#eab344');
	Current.css('height','48px');
	Current.css('width','200px');
	Current.css('text-align:center');
	Current.css('display','block');
 	Current.css('border-style','solid');
	Current.css('border-width','4px');
	Current.css('border-color','#402a20');
	Current.css('border-radius','48px');
	myButton.onmouseover = function() {
	$(this).css('background-color','#ffd258');
	};
	myButton.onmouseout = function() {
	$(this).css('background-color','#eab344');
	};
	myButton.onclick = MuteMusic;
	placeHolder = document.getElementById("MuteMBut");
	placeHolder.appendChild(myButton);
	
	myButton = document.createElement("input");
	myButton.type = "button";
	myButton.value = "Mute Sound";
	myButton.id = "ButMS";
	Current = $(myButton);
	Current.css('font-family','Helvetica Neue,Helvetica Arial,sans-serif');
	Current.css('font-size','21px');
	Current.css('font-weight','bold');
	Current.css('text-decoration','none');
	Current.css('color','#402a20');
	Current.css('background-color','#eab344');
	Current.css('height','48px');
	Current.css('width','200px');
	Current.css('text-align:center');
	Current.css('display','block');
 	Current.css('border-style','solid');
	Current.css('border-width','4px');
	Current.css('border-color','#402a20');
	Current.css('border-radius','48px');
	myButton.onmouseover = function() {
	$(this).css('background-color','#ffd258');
	};
	myButton.onmouseout = function() {
	$(this).css('background-color','#eab344');
	};
	myButton.onclick = MuteSound;
	placeHolder = document.getElementById("MuteSBut");
	placeHolder.appendChild(myButton);
	

	myButton = document.createElement("input");
	myButton.type = "button";
	myButton.value = "Start Game";
	myButton.id = "ButSG";
	Current = $(myButton);
	Current.css('font-family','Helvetica Neue,Helvetica Arial,sans-serif');
	Current.css('font-size','21px');
	Current.css('font-weight','bold');
	Current.css('text-decoration','none');
	Current.css('color','#402a20');
	Current.css('background-color','#eab344');
	Current.css('height','48px');
	Current.css('width','200px');
	Current.css('text-align:center');
	Current.css('display','block');
 	Current.css('border-style','solid');
	Current.css('border-width','4px');
	Current.css('border-color','#402a20');
	Current.css('border-radius','48px');
	myButton.onmouseover = function() {
	$(this).css('background-color','#ffd258');
	};
	myButton.onmouseout = function() {
	$(this).css('background-color','#eab344');
	};
	myButton.onclick = MuteSound;
	placeHolder = document.getElementById("startbutton");
	placeHolder.appendChild(myButton);
	
	
	
	console.log(PLAYGROUND_HEIGHT/2-$("#ButSG").height());
	console.log($("#playground").height());
	
	
	
	
	//Create the first level.
	CreateLevel();
	MuteMusic();
	
	Scores = new Array();
	
	/*//Create a line containing the 10 best scores, and apply them to the div.
	$.get('http://www.starship-games.com/GetHighscore.php', {} , function(data) {
		for (i=0; i<data.length/2; i++)
		{
			Scores[i] = {score: data[i*2+1], name: data[i*2]};
			console.log( data[i*2+1]);
		}
	}, 'json');*/
	
	Scores.sort(CustomSort);
					
    // this sets the id of the loading bar (NOT USED YET):
	$.loadCallback(function(percent){
            $("#loadingBar").width(400*percent);
      });
    //initialize the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
			Then = new Date().getTime();
			GameStart = true;
			soundBG.play( createjs.Sound.INTERRUPT_NONE, 0, 0, 1)
            $("#welcomeScreen").remove();
        });
    })
	// Debug code is for debug
	$("#TrykEnter").click(function(){
		if (Ended == 1)
			{
				//If we are entering our name show the highscore
				$("#HighscoreHUD").remove();
				
				//Consider loading this earlier, possibly when starting the game, and than manually inserting the player score
				//both off.line and online.
				
				ShowHighscore();
			}
			else
			{
			//Else, restart the game.
			Restarted = true;
			RestartGame();
			}
			
			//Send the highscore to the database.
			ApplyHighscore( {name: Name, score: Points} );
			
			return false;
	})
	//Debug code ends

	
    //THIS IS THE MAIN LOOP
    $("#playground").registerCallback(function()
	{
		if (Ended == 2)
		{
			var Current = $("#HighscoreHUD");
			//If we are showing the highscore, center the highscore on the screen each frame, in case the resolution changes.
			Current.html(Line+"<br>Tryk Enter for at starte et nyt spil");
			Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
		}
		else
		if (Ended == 1)
		{
			//If we are entering our name:
			//Generate a string based on the name varaible, which is changed in onkeypress
			var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
			var Current = $("#HighscoreHUD");
			//Apply the string to the div, and recenter it.
			Current.html(string);
			Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
		}
		else
		{
			//Basic Game Engine!!
			
			//Use this to get delta (The amount of milliseconds since last frame).
			Now = new Date().getTime();
			Delta = Now - Then;
			
			if (PointsV<Points)
			{
				PointsV+=((Points - PointsV)/300+0.33) * (Delta);
			}
			
			if (PointsV>Points) PointsV=Points;
			
		
			
			
			var ScaleUI = Math.max(  Math.min((SpaceY - (CARDSIZEY+EMPTYSPACE)/2*Scale)/192,1) , Math.min((SpaceX - (CARDSIZEX+EMPTYSPACE)/2*Scale)/384,1)  );
			
			current = $('#PointHUD');
			current.html("Points: "+Math.round(PointsV));
			current.css({ left: Math.floor((ButSpace*3+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
			
			
			current = $("#TimeHUD");
			current.html("Time: "+Math.ceil(CurGameTime/1000));
			current.css({ left: Math.floor((ButSpace*2+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
			
			if(GameStart = true)
			{
			CurGameTime= CurGameTime-Delta;
			}
			
			ForEachCard(function()
			{
				//For each card, perform their step event.
				this.Cards.Step();
			});
			
			ForEachGFX(function()
			{
				//For each card, perform their step event.
				this.GFX.Step();
			});
			
			//DEBUG DEBUG DEBUG
			if ($.gQ.keyTracker[65])
			{
				if (LastA==false)
				{
					LastA=true;
					
				}
			}
			else
				LastA=false;
				
			if ($.gQ.keyTracker[80])
			{
				if (LastP==false)
				{
					LastP=true;
					PauseGame();
		
				}
			}
			else
				LastP=false;
				
			if ($.gQ.keyTracker[79])
			{
				if (LastO==false)
				{
					LastO=true;
					ResumeGame();
				}
			}
			else
				LastO=false;

			//Ends game if GameTime hits 0
			if (CurGameTime <= 0)
			{
				$("#TimeHUD").html("Time: 0");
				EndGame();
			}
			
			//Calculate how many cards has been matched.
			var Turned = 0;
			ForEachCard(function()
			{
				if (this.Cards.visible == false && this.Cards.Bonus==false)
				Turned++;
			});
			
			//If we have matched all the cards.
			if (Turned >= LM.NumberOfCards)
			{
				DoneTimer+=Delta;
				Done = true;
				//If done, count the timer up to create a delay before next level.
				if (DoneTimer>1000)
				{
					DoneTimer=0;
					Points+=Math.round(CurGameTime/100) + CurLevel * 100;
					Done = false;
					//Once done, reset the control variables, and remove all cards.
					for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
					{
						$("#Card_"+i).remove();
					}
					
					//Then create next level.
					Restarted = false;
					CreateLevel();
				}
			}
		
			Then = Now;
			
		}
		EndedL=Ended;
	//Loop
    }, Math.min(0,REFRESH_RATE-Delta));
	
	//This function is used for the loading spinner.
	//We have little idea how it works.
	$.fn.spin = function(opts) {
		this.each(function() {
			var $this = $(this),
			spinner = $this.data('spinner');

			if (spinner) spinner.stop();
			if (opts !== false) {
			opts = $.extend({color: $this.css('color')}, opts);
			spinner = new Spinner(opts).spin(this);
			$this.data('spinner', spinner);
			}
			});
			return this;
			};
			$(function() {
			$(".spinner-link").click(function(e) {
			e.preventDefault();
			$(this).hide();
			var opts = {
			lines: 12, // The number of lines to draw
			length: 7, // The length of each line
			width: 5, // The line thickness
			radius: 10, // The radius of the inner circle
			color: '#fff', // #rbg or #rrggbb
			speed: 1, // Rounds per second
			trail: 66, // Afterglow percentage
			shadow: true // Whether to render a shadow
			};
			$("#spin").show().spin(opts);

		});
	});

});

	
