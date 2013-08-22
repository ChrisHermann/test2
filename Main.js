// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;


var percent = 1;
    
// --------------------------------------------------------------------
// --                      the main declaration:                     --
// --------------------------------------------------------------------

$(function(){
	//Calculate playground width and height:
	PLAYGROUND_WIDTH = $(window).width() - 20;
	PLAYGROUND_HEIGHT = $(window).height() - 20;

	//Calculate Layour for responsive Design.
	//Calculate Area:
	var CARDSIZEX = 208;
	var CARDSIZEY = 208;
	var EMPTYSPACE = 5;
	var NumberOfCards = 6;
	var NumberOfCardsBonus = 4;
	Points = 0;
	Autocomplete = false;
	
	
	
	var Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
	Ratio =  (Ratio+1)/2;
	
	var noc = Math.sqrt(NumberOfCards + NumberOfCardsBonus);
	
	var SpaceX = PLAYGROUND_WIDTH/ Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1));
	var SpaceY = PLAYGROUND_HEIGHT/(  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    )  + 1));
	
	var LastYOff = 0;
	
	if (Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1)) !=  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) % ((Math.ceil(noc*Ratio )))    )  + 1))
	{
		LastYOff = (Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1)) -  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) % ((Math.ceil(noc*Ratio )))    )  + 1))/2 * SpaceX;
	}
	
	if (SpaceX >= CARDSIZEX+EMPTYSPACE)
	{
		var Scale1 = 1;
	}
	else
	{
		var Scale1 = SpaceX/(CARDSIZEX+EMPTYSPACE);
	}
	
	if (SpaceY >= CARDSIZEY+EMPTYSPACE)
	{
		var Scale2 = 1;
	}
	else
	{
		var Scale2 = SpaceY/(CARDSIZEY+EMPTYSPACE);
	}
	
	var Scale = Math.min(Scale1, Scale2);

    // Animations declaration: 
    // The background:    
	
	var DM = new DeckManager();
	var IM = new ImageManager();
	
	
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
        //Your function goes here
		
		
		//Calculate playground width and height:
		PLAYGROUND_WIDTH = $(window).width() - 20;
		PLAYGROUND_HEIGHT = $(window).height() - 20;

		//Calculate Layour for responsive Design.
		//Calculate Area:
		var CARDSIZEX = 208;
		var CARDSIZEY = 208;
		var EMPTYSPACE = 5;
		var NumberOfCards = 6;
		var NumberOfCardsBonus = 1;
		
		
		var Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
		Ratio =  (Ratio+1)/2;
		
		var noc = Math.sqrt(NumberOfCards + NumberOfCardsBonus);
		
		var SpaceX = PLAYGROUND_WIDTH/ Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1));
		var SpaceY = PLAYGROUND_HEIGHT/(  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    )  + 1));
		
		var LastYOff = 0;
		
		if (Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1)) !=  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) % ((Math.ceil(noc*Ratio )))    )  + 1))
		{
			LastYOff = (Math.min((NumberOfCards + NumberOfCardsBonus + 1) ,Math.ceil(noc*Ratio + 1)) -  Math.min((NumberOfCards + NumberOfCardsBonus + 1) , Math.ceil( (NumberOfCards + NumberOfCardsBonus) % ((Math.ceil(noc*Ratio )))    )  + 1))/2 * SpaceX;
		}
		
		if (SpaceX >= CARDSIZEX+EMPTYSPACE)
		{
			var Scale1 = 1;
		}
		else
		{
			var Scale1 = SpaceX/(CARDSIZEX+EMPTYSPACE);
		}
		
		if (SpaceY >= CARDSIZEY+EMPTYSPACE)
		{
			var Scale2 = 1;
		}
		else
		{
			var Scale2 = SpaceY/(CARDSIZEY+EMPTYSPACE);
		}
		
		var Scale = Math.min(Scale1, Scale2);
		
		
		
		$("#playground").playground({
        height: PLAYGROUND_HEIGHT, 
        width: PLAYGROUND_WIDTH});
		
		var i=0;
		$(".Cards").each(function()
		{
			//For each card, perform their step event.
			this.Cards.scale = Scale;
			
			this.Cards.Update({posx: (i%(Math.ceil(noc*Ratio))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (NumberOfCards + NumberOfCardsBonus) - ((NumberOfCards + NumberOfCardsBonus)%(Math.ceil(noc*Ratio))) ) , posy: Math.floor( i / (Math.ceil(noc*Ratio))  ) * SpaceY + SpaceY - 152 });
			i++;
		});
		
		
    };
	
	
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
    //Setup Card data so they can be reached randomly
	var Vals = new Array();
	var Vals2 = new Array();
	Turned = 0;
	var TurnedMax = 2;
	
	//This will ensure that two cards of each are added to the deck
	//This function will be handled by the imagemanager at later stages.
    for (var i = 0; i < NumberOfCards; ++i)
	{
		Vals[i] = Math.floor(i/2);
	}
	
	Vals2[0]=3;
	Vals2[1]=4;
	Vals2[2]=5;
	Vals2[3]=6;
	
	DM.Create(Vals, Vals2, NumberOfCards, 1);
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
		.addGroup("overlay", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
								 
								 
	$("#overlay").append("<div id='PointHUD'style='color: white; width: 200px; position: absolute; left: 0px; font-family: verdana, sans-serif;'></div>");
								 
	//In this stage we spawn the actual cards, right now this is a huge function.
	//Imagemanager and deckmanager will make this function a lot smaller.
	for (var i = 0; i < NumberOfCards+NumberOfCardsBonus; ++i)
	{
		//Generate unique ID for the card
		var name = "Card_"+i;
		
		val = DM.PushCard();
		
		//Add the actual card to the playground, we spawn them in a responsive awy based on the resolution of the game.
		$("#Cards").addSprite(name, {animation: IM.GetBack(), width: 208, height: 303, posx: (i%(Math.ceil(noc*Ratio))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (NumberOfCards + NumberOfCardsBonus) - ((NumberOfCards + NumberOfCardsBonus)%(Math.ceil(noc*Ratio))) ) , posy: Math.floor( i / (Math.ceil(noc*Ratio))  ) * SpaceY + SpaceY - 152 });//.addSound(flipSound);;
		
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
			$(".Cards").each(function()
			{
				if (this.Cards.visible && (this.Cards.Turning==true || this.Cards.FlippedV==true))
				{
					Ready++;
				}
			});
			//Find all the objects with the tag/class card.
				//Check if the mouse clicked the card, if it's still part of the game, and if it has not been flipped.
				
			
			if (this.Cards.visible==true && this.Cards.Flipped == false  && this.Cards.Turning == false
			&& Ready<TurnedMax)
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
						$(".Cards").each(function()
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
						$(".Cards").each(function()
						{
							//For each card, if they are flipped, are not going into hiding/deletion, and has the
							//Correct value, increase the counter for the number of cards matching.
							if (this.Cards.Flipped == true && this.Cards.Hiding==0 && this.Cards.value == Correct)
								CorrectAmount++;
							
						});
						
						//If we have a correct match
						if (CorrectAmount==TurnedMax)
						{
							$(".Cards").each(function()
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
						
						$(".Cards").each(function()
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
	
    // this sets the id of the loading bar (NOT USED YET):
	$.loadCallback(function(percent){
            $("#loadingBar").width(400*percent);
      });
    //initialize the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
            $("#welcomeScreen").remove();
			$("#background").playSound();
        });
    })
    
    
    //This is for the background animation (DEBUG)
    $("#playground").registerCallback(function(){
	
	
	
	//Basic Game Engine!!
	
	$(".Cards").each(function()
	{
		//For each card, perform their step event.
		this.Cards.Step();
	});
	
	
	$("#PointHUD").html("Points: "+Points);	
	
    }, REFRESH_RATE);
});