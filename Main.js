// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;


var percent = 1;


//Global function that applies a function to all cards.
//We avoid $("#Card").each because it's very slow in ie8.
function ForEachCard(Function)
{
	for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
	{
		Function.apply($("#Card_"+i)[0]);
	}
}
// --------------------------------------------------------------------
// --                      the main declaration:                     --
// --------------------------------------------------------------------

//This game uses gamequery. The documentation for this can be found at:
//http://gamequeryjs.com/documentation/
//It is purely made in the DOM and as such does not use canvas at all.

$(function(){
	//Custom sorting function, so the array knows to sort based on an attribute.
	function CustomSort(a,b)
	{
		return(b.score-a.score);
	}
	
	//TEST HIGHSCORE
	//TODO: DELETE!!!
	Scores = new Array();
	Scores[0]={score: 100, name: "SSH"};
	Scores[1]={score: 200, name: "SSH"};
	Scores[2]={score: 500, name: "SSH"};
	Scores[3]={score: 300, name: "SSH"};
	Scores[4]={score: 400, name: "SSH"};
	Scores[5]={score: 450, name: "SSH"};
	Scores[6]={score: 10000, name: "SSH"};
	Scores[7]={score: 20, name: "SSH"};
	Scores[8]={score: 150, name: "SSH"};
	Scores[9]={score: 160, name: "SSH"};
	Scores[10]={score: 170, name: "SSH"};
	
	Scores.sort(CustomSort);
	
	

	//Calculate playground width and height:
	PLAYGROUND_WIDTH = $(window).width() - 20;
	PLAYGROUND_HEIGHT = $(window).height() - 20;

	//Calculate Layour for responsive Design.
	//Calculate Area:
	var CARDSIZEX = 208;
	var CARDSIZEY = 208;
	var EMPTYSPACE = 5;
	var DoneTimer = 0;
	var Done = false;
	var Ended = 0;
	var EndedL = 0;
	var Name = "";
	Points = 0;
	Autocomplete = false;

	Now = 0;
	
	Delta = 0;
	
	var Then = new Date().getTime();
	
	var GameTime = 30;
	
	function subSec()
	{
		GameTime--;
	}
	
	var LastA=false;
	
	
    // Animations declaration: 
    // The background:    
	
	var DM = new DeckManager();
	var IM = new ImageManager();
	LM = new LevelManager();
	LM.Create(6,10);
	
	
	IM.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
	
	
		
	//Sounds
	 createjs.Sound.registerSound("./flipcard.wav", "sound");
	 createjs.Sound.registerSound("./music.mp3", "bgmusic");

	
	//Loads the normal card faces
	var Face = new Array();
	IM.Load("http://www.damienriley.com/wp-content/uploads/2009/09/ist2_5106943-king-card.jpg");
	IM.Load("http://i.istockimg.com/file_thumbview_approve/6844208/2/stock-illustration-6844208-jack-of-diamonds-two-playing-card.jpg");
	IM.Load("http://www.danielveazey.com/wp-content/uploads/2012/03/queen-of-hearts.jpg");
	
	//Loads the bonus card faces. The ID's of these are important, as they needs to be used in Card.RunBonus();
	SWARTZID = IM.Load("http://www.towergaming.com/images/media-room/articles/joker-card.png");
	POINTID = IM.Load("http://static8.depositphotos.com/1035986/841/v/950/depositphotos_8416424-Joker-Clown-playing-cards-hubcap-focus-trick-circus-fun-lough.jpg");
	PAIRID = IM.Load("http://www.dwsmg.com/wp-content/uploads/2011/02/valentine-cards-24.jpeg");
	CONFUSEID = IM.Load("http://www.usgreencardoffice.com/uploads/images/usgco_liberty.jpg");
		
		
	
    

	//This functions "creates a level" this function is run when there is an empty screen to set up
	//everything for the next level.
	function CreateLevel()
	{
		//First go to next level to increase the difficulty.
		LM.NextLevel();
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
			$("#Cards").addSprite(name, {animation: IM.GetBack(), width: 208, height: 303, posx: (i%(Math.ceil(noc))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (LM.NumberOfCards + LM.NumberOfCardsBonus) - ((LM.NumberOfCards + LM.NumberOfCardsBonus)%(Math.ceil(noc))) ) , posy: Math.floor( i / (Math.ceil(noc))  ) * SpaceY + SpaceY - 152 });
			
			//Create the actual class for the card, this will add logic to the object.
			var Current = $("#"+name)[0];
			Current.Cards = new Cards($("#"+name));
			Current.Cards.Create(val, IM.GetImage(val), IM.GetImage(3), IM.GetBack(), DM.LastBonus(), Scale);
			
			
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
		PLAYGROUND_WIDTH = $(window).width() - 20;
		PLAYGROUND_HEIGHT = $(window).height() - 20;
		
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
		
		//Now choose the lesser of hte scalings, because this one will be the one to actually be applied.
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
    };
	
	//Function to end the game
	function EndGame()
	{
		//Correct the variables, and create a div to store the screen to enter your name.
		Ended = 1;
		Name = "";
		$("#overlay").append("<div id='HighscoreHUD'style='color: white; text-align: center; position: absolute; left: 0px; font-family: verdana, sans-serif; font-size: 200%;'></div>");							 
	
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
	
		Ended = 0;
		//This is the easiest way to reset the levelmanager.
		LM.Create(6,10);
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
				ShowHighscore();
			}
			else
				//Else, restart the game.
				RestartGame();
			
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
		
		//Create a line containing the 10 best scores, and apply them to the div.
		var Line = "<br>";
		for(i=0; i<10; i++)
		{
			Line+=(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"<br>";
		}
		var Current = $("#HighscoreHUD");
		Current.html(Line+"<br>Tryk Enter for at starte et nyt spil");
		
		//Create new div for high score.
		$("#overlay").append("<div id='HighscoreHUD'style='color: white; text-align: center; position: absolute; left: 0px; font-family: verdana, sans-serif; font-size: 200%;'></div>");							 
	
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
		.addGroup("overlay", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
								 
	//Create a div for the Point UI.
	$("#overlay").append("<div id='PointHUD'style='color: white; width: 200px; position: absolute; left: 0px; font-family: verdana, sans-serif;'></div>");
	
	//Create the first level.
	$("#overlay").append("<div id='TimeHUD'style='color: white; width: 200px; position: absolute; left: 200px; font-family: verdana, sans-serif; float: right;'></div>");

	//Create the first level.
	CreateLevel();
					
    // this sets the id of the loading bar (NOT USED YET):
	$.loadCallback(function(percent){
            $("#loadingBar").width(400*percent);
      });
    //initialize the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
			var spinner = new Spinner().spin();
				  background.appendChild(spinner.el);
			
			createjs.Sound.play("bgmusic");
			setInterval(subSec,1000);
            $("#welcomeScreen").remove();
			$("#background").playSound();
        });
    })
    
    
    //THIS IS THE MAIN LOOP
    $("#playground").registerCallback(function(){
	if (Ended == 2)
	{
		//If we are showing the highscore, center the highscore on the screen each frame, in case the resolution changes.
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
		
		//Use this to get delta (The amout of milliseconds since last frame).
		Now = new Date().getTime();
		Delta = Now - Then;	
		
		
		$("#PointHUD").html("Points: "+Points);	
		
		$("#TimeHUD").html("Time: "+GameTime);
		
		
		ForEachCard(function()
		{
			//For each card, perform their step event.
			this.Cards.Step();
		});
		
		//DEBUG DEBUG DEBUG
		if ($.gQ.keyTracker[65])
		{
			if (LastA==false)
			{
				LastA=true;
				EndGame();
			}
		}
		else
			LastA=false;
		
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
			DoneTimer++;
			Done = true;
			//If done, count the timer up to create a delay before next level.
			if (DoneTimer>30)
			{
				DoneTimer=0;
				Done = false;
				//Once done, reset the control variables, and remove all cards.
				for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
				{
					$("#Card_"+i).remove();
				}
				
				//Then create next level.
				CreateLevel();
			}
		}
	
	Then = Now;
		
	}
	EndedL=Ended;
	//Loop
    }, Math.min(0,REFRESH_RATE-Delta));
	
	//This function is used for the loading spinnner.
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