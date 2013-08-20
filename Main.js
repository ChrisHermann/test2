// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;

//Constants for the gameplay
var smallStarSpeed        = 1; //pixels per frame
    
var mediumStarSpeed       = 3; //pixels per frame
    
var bigStarSpeed          = 5; //pixels per frame

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

    // Animations declaration: 
    // The background:    
	
	var DM = new DeckManager;
	var IM = new ImageManager;
	
	IM.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
	
	
	//DEBUG: Loading images for demo, this should be done using the image manager in the actual game.
    var background1 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background1.png"});
    var background2 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background2.png"}); 
    var background3 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background3.png"});
    var background4 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background4.png"});
    var background5 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background5.png"});
    var background6 = new $.gameQuery.Animation({
        imageURL: "http://gamequeryjs.com/demos/3/background6.png"});
		
				//Sounds
		var bgmusic = new $.gameQuery.SoundWrapper("./music.mp3", true);
		//var flipSound = new $.gQ.SoundWrapper("./flipcard.wav", false);
		//var bgmusic = document.getElementById('music'.mp3);
		
		
		var Face = new Array();
		IM.Load("http://www.madore.org/~david/images/cards/english/king-hearts.png");
		IM.Load("http://www.madore.org/~david/images/cards/english/jack-hearts.png");
		IM.Load("http://us.123rf.com/400wm/400/400/rbwinston/rbwinston1203/rbwinston120300001/12586605-king-of-spades-individual-playing-card--an-isolated-vector-illustration-of-a-classic-face-card.jpg");

		//Important Card ID: 3 - Swartz
		IM.Load("http://fc02.deviantart.net/fs71/i/2010/344/e/6/mr_pale_face_evil_man_by_totmoartsstudio2-d34mvci.jpg");
		
	
	var resizeTimer;

    //Event to handle resizing
	//This event should fire under any circimstance, except when safari is NOT maximized, and windows resolution is changed (WTF?)
    $(window).resize(function () 
    {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(Resized, 100);
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
                                 height: PLAYGROUND_HEIGHT})
        .addSprite("background1", {animation: background1, 
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT})	
        .addSprite("background2", {animation: background2,
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT, 
                                   posx: PLAYGROUND_WIDTH})
        .addSprite("background3", {animation: background3, 
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT})
        .addSprite("background4", {animation: background4, 
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT, 
                                   posx: PLAYGROUND_WIDTH})
        .addSprite("background5", {animation: background5, 
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT})
        .addSprite("background6", {animation: background6, 
                                   width: PLAYGROUND_WIDTH, 
                                   height: PLAYGROUND_HEIGHT, 
                                   posx: PLAYGROUND_WIDTH})
		$("#background").addSound(bgmusic);
    //Setup Card data so they can be reached randomly
	var Vals = new Array();
	var Vals2 = new Array();
	var Turned = 0;
	var TurnedMax = 2;
	
	//This will ensure that two cards of each are added to the deck
	//This function will be handled by the imagemanager at later stages.
    for (var i = 0; i < NumberOfCards; ++i)
	{
		Vals[i] = Math.floor(i/2);
	}
	
	Vals2[0]=3;
	
	DM.Create(Vals, Vals2, NumberOfCards, 1);
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
	//In this stage we spawn the actual cards, right now this is a huge function.
	//Imagemanager and deckmanager will make this function a lot smaller.
	for (var i = 0; i < NumberOfCards+1; ++i)
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
			$(".Cards").each(function()
			{
				//Check if the mouse clicked the card, if it's still part of the game, and if it has not been flipped.
				if (e.pageX - $("#playground").position().left >= this.Cards.node.x() + this.Cards.WIDTH/2 -  this.Cards.WIDTH/2*this.Cards.scale &&
				e.pageX - $("#playground").position().left < this.Cards.node.x() + this.Cards.WIDTH/2 -  this.Cards.WIDTH/2*this.Cards.scale + this.Cards.node.w()*this.Cards.scale &&
				e.pageY - $("#playground").position().top >= this.Cards.node.y()  + this.Cards.HEIGHT/2 -  this.Cards.HEIGHT/2*this.Cards.scale &&
				e.pageY - $("#playground").position().top < this.Cards.node.y()  + this.Cards.HEIGHT/2 -  this.Cards.HEIGHT/2*this.Cards.scale + this.Cards.node.h()*this.Cards.scale &&
				this.Cards.visible==true && this.Cards.Flipped == false  && this.Cards.Turning == false
				&& Ready<TurnedMax)
				{
					//Run the clicked event for the card, this will start events etc.
					this.Cards.Clicked();
					//Increase the turned counter, if we have turned the correct amount of cards to be compared
					//then compare them.
					if (this.Cards.Bonus == false)
					{
						Turned++;
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
										this.Cards.SetVisible(false);
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
	
	$("#background1").x(($("#background1").x() + smallStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background2").x(($("#background2").x() + smallStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	$("#background3").x(($("#background3").x() + mediumStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background4").x(($("#background4").x() + mediumStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	$("#background5").x(($("#background5").x() + bigStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background6").x(($("#background6").x() + bigStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	
	//Basic Game Engine!!
	
	$(".Cards").each(function()
	{
		//For each card, perform their step event.
		this.Cards.Step();
	});
	
    }, REFRESH_RATE);
});