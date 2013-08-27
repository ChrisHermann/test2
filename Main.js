// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;


var percent = 1;


	
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

$(function(){
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
	
	var LastA=false;
	
	
    // Animations declaration: 
    // The background:    
	
	var DM = new DeckManager();
	var IM = new ImageManager();
	LM = new LevelManager();
	LM.Create(6,10);
	
	
	IM.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
	
	
		
	//Sounds
	var bgmusic = new $.gameQuery.SoundWrapper("./music.mp3", true);
	//var flipSound = new $.gQ.SoundWrapper("./flipcard.wav", false);
	//var bgmusic = document.getElementById('music'.mp3);
	
	
	var Face = new Array();
	IM.Load("http://www.damienriley.com/wp-content/uploads/2009/09/ist2_5106943-king-card.jpg");
	IM.Load("http://i.istockimg.com/file_thumbview_approve/6844208/2/stock-illustration-6844208-jack-of-diamonds-two-playing-card.jpg");
	IM.Load("http://www.danielveazey.com/wp-content/uploads/2012/03/queen-of-hearts.jpg");
	
	//Important Card ID: 3 - Swartz
	IM.Load("http://www.towergaming.com/images/media-room/articles/joker-card.png");
	IM.Load("http://static8.depositphotos.com/1035986/841/v/950/depositphotos_8416424-Joker-Clown-playing-cards-hubcap-focus-trick-circus-fun-lough.jpg");
	IM.Load("http://www.dwsmg.com/wp-content/uploads/2011/02/valentine-cards-24.jpeg");
	IM.Load("http://www.usgreencardoffice.com/uploads/images/usgco_liberty.jpg");
		
		
	
    

	
	function CreateLevel()
	{
		LM.NextLevel();
		Resized();
		
		//Setup Card data so they can be reached randomly
		var Vals = new Array();
		var Vals2 = new Array();
		Turned = 0;
		var TurnedMax = 2;
		
		//This will ensure that two cards of each are added to the deck
		//This function will be handled by the imagemanager at later stages.
		for (var i = 0; i < LM.NumberOfCards; ++i)
		{
			Vals[i] = Math.floor(i/2);
		};
		
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
			$("#Cards").addSprite(name, {animation: IM.GetBack(), width: 208, height: 303, posx: (i%(Math.ceil(noc))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (LM.NumberOfCards + LM.NumberOfCardsBonus) - ((LM.NumberOfCards + LM.NumberOfCardsBonus)%(Math.ceil(noc))) ) , posy: Math.floor( i / (Math.ceil(noc))  ) * SpaceY + SpaceY - 152 });//.addSound(flipSound);;
																	 
			//Add a class to the card, this, does nothing except make us able to search for objects with the same class later in the code.
			$("#"+name).addClass("Cards");
			
			//Create the actual class for the card, this will add logic to the object.
			$("#"+name)[0].Cards = new Cards($("#"+name));
			$("#"+name)[0].Cards.Create(val, IM.GetImage(val), IM.GetImage(3), IM.GetBack(), DM.LastBonus(), Scale);
			
			
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
		
		
		Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
		Ratio =  (Ratio+1)/2;
		
		noc = Math.sqrt(LM.NumberOfCards + LM.NumberOfCardsBonus);
		
		SpaceX = PLAYGROUND_WIDTH/ Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1));
		SpaceY = PLAYGROUND_HEIGHT/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    )  + 1));
		
		
		noc = (LM.NumberOfCards + LM.NumberOfCardsBonus)/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    ) ));
		SpaceX = PLAYGROUND_WIDTH/ Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1));
		
		LastYOff = 0;
		
		if (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) !=  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))
		{
			LastYOff = (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) -  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))/2 * SpaceX;
		}
		
		if (SpaceX >= CARDSIZEX+EMPTYSPACE)
		{
			Scale1 = 1;
		}
		else
		{
			Scale1 = SpaceX/(CARDSIZEX+EMPTYSPACE);
		}
		
		if (SpaceY >= CARDSIZEY+EMPTYSPACE)
		{
			Scale2 = 1;
		}
		else
		{
			Scale2 = SpaceY/(CARDSIZEY+EMPTYSPACE);
		}
		
		Scale = Math.min(Scale1, Scale2);
		
		
		
		$("#playground").playground({
        height: PLAYGROUND_HEIGHT, 
        width: PLAYGROUND_WIDTH});
		
		
		//Could possibly use foreach, it's hard to handle uninitialized varables in foreach though.
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
	
	function EndGame()
	{
		Ended = 1;
		Name = "";
		$("#overlay").append("<div id='HighscoreHUD'style='color: white; text-align: center; position: absolute; left: 0px; font-family: verdana, sans-serif; font-size: 200%;'></div>");							 
	
		for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
		{
			$("#Card_"+i).remove();
		}
	}
	
	function RestartGame()
	{
		$("#HighscoreHUD").remove();
	
		Ended = 0;
		LM.Create(6,10);
		CreateLevel();
	}
	
	
	document.onkeypress = function(event)
	{
		var key_press = String.fromCharCode(event.keyCode);
		
		if (event.keyCode!=13 && key_press != " " && EndedL==1)
		Name += key_press;
	}
	
	$(document).keydown(function (e) {
	    if (e.which === 8)
	    {
			//your custom action here
		
			Name = Name.substring(0, Name.length - 1);
			return false;
 	    }
		if (event.keyCode==13)
		{
			if (Ended == 1)
				Ended=2;
			else
				RestartGame();
			
			ApplyHighscore( {name: Name, score: Points} );
			
			return false;
		}
	});
	
	
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
		$("#background").addSound(bgmusic);
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
		.addGroup("overlay", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
								 
								 
	$("#overlay").append("<div id='PointHUD'style='color: white; width: 200px; position: absolute; left: 0px; font-family: verdana, sans-serif;'></div>");
								 
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

            $("#welcomeScreen").remove();
			$("#background").playSound();
        });
    })
    
    
    //THIS IS THE MAIN LOOP
    $("#playground").registerCallback(function(){
	if (Ended == 2)
	{
		var Line = "<br>";
		for(i=0; i<10; i++)
		{
			Line+=(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"<br>";
		}
		$("#HighscoreHUD").html(Line+"<br>Tryk Enter for at starte et nyt spil");
		$("#HighscoreHUD").css({left: (PLAYGROUND_WIDTH - $("#HighscoreHUD").width())/2, top:  (PLAYGROUND_HEIGHT - $("#HighscoreHUD").height())/2});
	}
	else
	if (Ended == 1)
	{
		var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
		$("#HighscoreHUD").html(string);
		$("#HighscoreHUD").css({left: (PLAYGROUND_WIDTH - $("#HighscoreHUD").width())/2, top:  (PLAYGROUND_HEIGHT - $("#HighscoreHUD").height())/2});
	}
	else
	{
		//Basic Game Engine!!
		
		$("#PointHUD").html("Points: "+Points);	
		
		
		ForEachCard(function()
		{
			//For each card, perform their step event.
			this.Cards.Step();
		});
		
		
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
		
		
		var Turned = 0;
		ForEachCard(function()
		{
			if (this.Cards.visible == false && this.Cards.Bonus==false)
			Turned++;
		});
		
		if (Turned >= LM.NumberOfCards)
		{
			DoneTimer++;
			Done = true;
			if (DoneTimer>30)
			{
				DoneTimer=0;
				Done = false;
				for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
				{
					$("#Card_"+i).remove();
				}
				
				
				CreateLevel();
			}
		}
	}
	EndedL=Ended;
    }, REFRESH_RATE);
	
	
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