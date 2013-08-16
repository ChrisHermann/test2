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
	
    for (var i = 0; i < 6; ++i)
	{
		Vals[i] = Math.floor(i/2) + 1;
	}
	
	//Generate the actual Cards
	
		$.playground()
		.addGroup("Cards", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT})
	
	for (var i = 0; i < 6; ++i)
	{
		var name = "Card_"+i;
		var r = Math.floor(Math.random()*(Vals.length));
		var val = Vals[r];
		//Used for counting
		var l = Vals.length;
		for (var ii = 0; ii < l; ++ii)
		{
			if (ii==l - 1)
			{
				Vals.splice(l - 1,1);
			}
			else
			if (ii>=r)
			{
				Vals[ii] = Vals[ii + 1];
			}
		}
		console.log((i*240)%(PLAYGROUND_WIDTH) );
		$("#Cards").addSprite(name, {animation: Face[0], width: 208, height: 303, posx: (i*240)%(PLAYGROUND_WIDTH-239) , posy:5 + Math.floor( i / Math.floor(PLAYGROUND_WIDTH/240)  ) * 340 });
		
		$("#"+name).addClass("Cards");
		$("#"+name)[0].Cards = new Cards($("#"+name));
		$("#"+name)[0].Cards.Create(val, Face[val], Face[0], i);
		
		$("#"+name).mousedown(function(e)
		{
			$(".Cards").each(function()
			{
				if (e.pageX - $("#playground").position().left >= this.Cards.node.x() &&
				e.pageX - $("#playground").position().left < this.Cards.node.x() + this.Cards.node.w() &&
				e.pageY - $("#playground").position().top >= this.Cards.node.y()&&
				e.pageY - $("#playground").position().top < this.Cards.node.y() + this.Cards.node.h()&&
				this.Cards.visible==true)
				{
					this.Cards.Clicked();
					Turned++;
					if (Turned==TurnedMax)
					{
						//We have turned the amount of cards needed
						
						var Correct = this.Cards.value;
						var CorrectAmount = 0;
						$(".Cards").each(function()
						{
							if (this.Cards.Flipped == true && this.Cards.Hiding==0 && this.Cards.value == Correct)
								CorrectAmount++;
							
						});
						
						
						if (CorrectAmount==TurnedMax)
						{
							$(".Cards").each(function()
							{
								if (this.Cards.Flipped==true)
									this.Cards.SetVisible(false);
							});
							console.log("YAY");
						}
						
							console.log(CorrectAmount + " - " + TurnedMax);
						$(".Cards").each(function()
						{
							if (this.Cards.Flipped==true && this.Cards.Hiding==0)
							this.Cards.Hide();
						});
						
						Turned=0;
					}
				}
			});
		});
		
								 
	}
	
    // this sets the id of the loading bar:
	$.loadCallback(function(percent){
            $("#loadingBar").width(400*percent);
      });
    //initialize the start button
    $("#startbutton").click(function(){
        $.playground().startGame(function(){
            $("#welcomeScreen").remove();
        });
    })
    
    
    //This is for the background animation
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
		this.Cards.Step();
	});
	
    }, REFRESH_RATE);
});