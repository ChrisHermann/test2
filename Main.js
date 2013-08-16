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
    // Animations declaration: 
    // The background:    
	
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
		
		var Face = new Array();
		Face[0] = new $.gameQuery.Animation({
        imageURL: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png"});
		Face[1] = new $.gameQuery.Animation({
        imageURL: "http://www.madore.org/~david/images/cards/english/king-hearts.png"});
		Face[2] = new $.gameQuery.Animation({
        imageURL: "http://www.madore.org/~david/images/cards/english/jack-hearts.png"});
		Face[3] = new $.gameQuery.Animation({
        imageURL: "http://us.123rf.com/400wm/400/400/rbwinston/rbwinston1203/rbwinston120300001/12586605-king-of-spades-individual-playing-card--an-isolated-vector-illustration-of-a-classic-face-card.jpg"});
		
		
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
								   
    //Setup Card data so they can be reached randomly
	var Vals = new Array();
	var Turned = 0;
	var TurnedMax = 2;
	
	//This will ensure that two cards of each are added to the deck
	//This function will be handled by the imagemanager at later stages.
    for (var i = 0; i < 6; ++i)
	{
		Vals[i] = Math.floor(i/2) + 1;
	}
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
	//In this stage we spawn the actual cards, right now this is a huge function.
	//Imagemanager and deckmanager will make this function a lot smaller.
	for (var i = 0; i < 6; ++i)
	{
		//Generate unique ID for the card
		var name = "Card_"+i;
		
		//Draw a random card from the deck
		var r = Math.floor(Math.random()*(Vals.length));
		var val = Vals[r];
		//Used for counting
		var l = Vals.length;
		
		//Then we need to remove the drawn card from the deck.
		for (var ii = 0; ii < l; ++ii)
		{
			if (ii==l - 1)
			{
				//Splice the last card to avoid dupes and to decrease the array length/RAM usage.
				Vals.splice(l - 1,1);
			}
			else
			if (ii>=r)
			{
				//Move all cards that are above the drawn card to one lesser index.
				Vals[ii] = Vals[ii + 1];
			}
		}
		
		//Add the actual card to the playground, we spawn them in a responsive awy based on the resolution of the game.
		$("#Cards").addSprite(name, {animation: Face[0], width: 208, height: 303, posx: (i%(Math.floor(PLAYGROUND_WIDTH/240))) *240 , posy:5 + Math.floor( i / Math.floor(PLAYGROUND_WIDTH/240)  ) * 340 });
		
		//Add a class to the card, this, does nothing except make us able to search for objects with the same class later in the code.
		$("#"+name).addClass("Cards");
		
		//Create the actual class for the card, this will add logic to the object.
		$("#"+name)[0].Cards = new Cards($("#"+name));
		$("#"+name)[0].Cards.Create(val, Face[val], Face[0], i);
		
		
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
				if (e.pageX - $("#playground").position().left >= this.Cards.node.x() &&
				e.pageX - $("#playground").position().left < this.Cards.node.x() + this.Cards.node.w() &&
				e.pageY - $("#playground").position().top >= this.Cards.node.y()&&
				e.pageY - $("#playground").position().top < this.Cards.node.y() + this.Cards.node.h()&&
				this.Cards.visible==true && this.Cards.Flipped == false  && this.Cards.Turning == false
				&& Ready<TurnedMax)
				{
					//Run the clicked event for the card, this will start events etc.
					this.Cards.Clicked();
					//Increase the turned counter, if we have turned the correct amount of cards to be compared
					//then compare them.
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
							console.log("YAY");
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