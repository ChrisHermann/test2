// Global constants:
var PLAYGROUND_WIDTH    = 700;
var PLAYGROUND_HEIGHT    = 250;
var REFRESH_RATE        = 30;

//Constants for the gameplay
var smallStarSpeed        = 1; //pixels per frame
    
var mediumStarSpeed       = 3; //pixels per frame
    
var bigStarSpeed          = 5; //pixels per frame

var percent = 1;

this.Cards = new Cards(4);
    
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

    // Initialize the game:
    $("#playground").playground({
        height: PLAYGROUND_HEIGHT, 
        width: PLAYGROUND_WIDTH, 
        keyTracker: true});

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
    
    
    // this sets the id of the loading bar:
    //$().setLoadBar("loadingBar", 400);
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
    $.playground().registerCallback(function(){
    //Offset all the pane:
	/*
    var newPos = (  parseInt($("#background1").css("left")) - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background1").css("left", newPos);

    newPos = (parseInt($("#background2").css("left")) - smallStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background2").css("left", newPos);

    newPos = (parseInt($("#background3").css("left")) - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background3").css("left", newPos);

    newPos = (parseInt($("#background4").css("left")) - mediumStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background4").css("left", newPos);

    newPos = (parseInt($("#background5").css("left")) - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background5").css("left", newPos);

    newPos = (parseInt($("#background6").css("left")) - bigStarSpeed - PLAYGROUND_WIDTH) % (-2 * PLAYGROUND_WIDTH) + PLAYGROUND_WIDTH;
    $("#background6").css("left", newPos);*/
	
	
	$("#background1").x(($("#background1").x() + smallStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background2").x(($("#background2").x() + smallStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	$("#background3").x(($("#background3").x() + mediumStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background4").x(($("#background4").x() + mediumStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	$("#background5").x(($("#background5").x() + bigStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	$("#background6").x(($("#background6").x() + bigStarSpeed +PLAYGROUND_WIDTH) % (2 * PLAYGROUND_WIDTH) - PLAYGROUND_WIDTH);
	
	
	//Basic Game Engine!!
	this.Cards.Step;
	
	this.Cards.Draw;
    }, REFRESH_RATE);
});

