/**
* @file
* The this file is main javascript file
*/

var REFRESH_RATE = 30;

Paused = false;
var MuteMusicBool = false;
var MuteSoundBool = false;

/**
* Global function that applies a function to all cards.
* We avoid $("#Card").each because it's very slow in ie8.
*
* @param function Function
* The function that each card needs to run. the card will refer to itself as this.
*/
function ForEachCard(Function) {
  for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i) {
    Function.apply($("#Card_"+i)[0]);
  }
}

/**
* Similar to ForEachCard, but with all GFX cards.
*
* @param function Function
* Tje fimctopm that eacj GFX needs to run, the GFX will refer to itself as this.
*/
function ForEachGFX(Function) {
  for (var i = 0; i < GFXCount; ++i) {
    if ($("#GFX_"+i)[0])
    Function.apply($("#GFX_"+i)[0]);
  }
}

/**
* This function pauses the game.
*/
function PauseGame() {
  //Do not pause the game before it has started, as this creates weird bugs.
  if(GameStart && !Paused) {
    Paused=true;
    BackgroundMusic.pause();
    Paused = true;
    
    $("#inputbox").hide();
    
    $("#ResumeButtonDiv").show();
  }
}

/**
* This function resumes the game after its been paused.
*/
function ResumeGame() {
  //Don't run the function if the game has not yet started, this creates weird bugs.
  if(GameStart && Paused) {
    $("#inputbox").show();
    Paused=false;
    //This is used to reset delta, so the game thinks no time has passed between the pause.
    Then = new Date().getTime();
    BackgroundMusic.resume();
    Paused = false;
    $("#ResumeButtonDiv").hide();
  }
}

/**
* Use this function to automatically alter between paused state and resumed state.
*/
function PauseResume() {
  if (Paused == false)
    PauseGame();
  else
    ResumeGame();
}

/**
* This function has two functions to mute and unmute music. It will detect what the music currently is, and do the opposite.
*/
function MuteMusic() {
  if (AppleDetect[0,0] != "iPad" || AppleDetect[0,0] == "Macintosh" || AppleDetect[0,0] == "iPhone" || AndroidDetect[0,0] == "Android") {
    function MuteMusic() {
      BackgroundMusic.setMute(true);
      MuteMusicBool = true;
    }
    function UnMuteMusic() {
      BackgroundMusic.setMute(false);
      MuteMusicBool = false;
    }
  
    //This is the actual call.
    if(MuteMusicBool == false)
      MuteMusic();
    else
      UnMuteMusic();
  }
}

/**
* This function has two functions to mute and unmute Sound. It will detect what the music currently is, and do the opposite.
*/
function MuteSound() {
  function MuteSound() {
    FlipCardSound.setMute(true);
    MuteSoundBool = true;
  }
  function UnMuteSound() {
    FlipCardSound.setMute(false);
    MuteSoundBool = false;
  }
  
  //This is the actual call.
  if(MuteSoundBool == false)
    MuteSound();
  else
    UnMuteSound();
}

/**
* segmenting the platform info
* platform detect.
*/
var PlatformTemporary = navigator.appVersion;
PlatformTemporary = PlatformTemporary.split(" ");
var PlatformDetect = PlatformTemporary[0,1] + " " + PlatformTemporary[0,0];
PlatformDetect = PlatformDetect.substring(1);
AppleDetect = PlatformDetect.split(";");
AndroidDetect = PlatformDetect.split(")");

/**
* --------------------------------------------------------------------
* -- the main declaration: --
* --------------------------------------------------------------------
*/

/**
* This game uses gamequery. The documentation for this can be found at:
* http://gamequeryjs.com/documentation/
* It is purely made in the DOM and as such does not use canvas at all.
*/

$(function(){
  
  document.body.style.overflow = "hidden";
  PLAYGROUND_WIDTH = $("#MemoryGamePlayground").width();
  PLAYGROUND_HEIGHT = $("#MemoryGamePlayground").height();
  console.log(PLAYGROUND_WIDTH);
  console.log(PLAYGROUND_HEIGHT);
  //var UserInterfaceSizeY = 170;

  
  $("#inputbox").hide();



  /**
   * Custom sorting function, so the array knows to sort based on an attribute.
   * @param a
   *   object a to be sorted.
   * @param b
   *   object b to be sorted.
   */
  function CustomSort(a,b) {
    return(b.score-a.score);
  }
  
  //Initiates a default highscore if there is none.
  if(!localStorage.LocalStorageScores) {
    ResetHighscore();
  }
  
  
  $("#MessageHUD").hide();
  $("#Leveldiv").hide();
  $("#HighscoreHUD").hide();
  $("#NameEnterHUD").hide();

  //Sets up all the variables needed for the game to run.
  var CARDSIZEX = 208;
  var CARDSIZEY = 208;
  var BACKGROUNDSIZE = {x: 2362, y: 1403};
  var EMPTYSPACE = 5;
  var DoneTimer = 0;
  var Done = false;
  var Ended = 0;
  var EndedLaster = 0;
  var Name = "";
  var Line;
  var Scores;
  //var HighscoreLines;
  var ShowingMessage = false;
  var ScaleUserInterface = 0;
  var Focused = false;
  var HasStartedLevelTransition = false;
  GFXCount = 0;
  Points = 1000000;
  PointsVisual = 0;
  AutoComplete = false;
  Restarted = false;
  
  Now = 0;
  Delta = 0;
  Then = new Date().getTime();
  
  
  var CoreGameTime = 5 * 1000;
  var CurrentGameTime = CoreGameTime;
  
  GameStart = false;

  //Change this if image resolution changes
  var CardSize = {x: 208,y: 303};
  CoreLevel = 0;
  CurrentLevel = CoreLevel;
  

  /**
  * Animations declaration:
  * The background:
  */
  var DeckManagerObject = new DeckManager();
  ImageManagerObject = new ImageManager();
  LevelManagerObject = new LevelManager();
  
  //Creates the imagemanager and loads the backcard.
  ImageManagerObject.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
  
  /**
  * Sounds
  * no background music on iPad
  */
  if (AppleDetect[0,0] != "iPad" || AppleDetect[0,0] == "Macintosh" || AppleDetect[0,0] == "iPhone") {
    BackgroundMusic = createjs.Sound.createInstance("./music.mp3");
    FlipCardSound = createjs.Sound.createInstance("./flipcard.wav");

  }
  
  //Loads the normal card faces
  var Face = new Array();
  ImageManagerObject.LoadCard("peter.png");
  ImageManagerObject.LoadCard("nicolaus.png");
  ImageManagerObject.LoadCard("schwartz.png");
  ImageManagerObject.LoadCard("http://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Cards-10-Diamond.svg/343px-Cards-10-Diamond.svg.png");
  ImageManagerObject.LoadCard("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Cards-9-Heart.svg/428px-Cards-9-Heart.svg.png");
  ImageManagerObject.LoadCard("http://allaboutcards.files.wordpress.com/2009/07/bp-frogace.jpg");
  ImageManagerObject.LoadCard("http://weandthecolor.com/wp-content/uploads/2013/02/8-Hearts-Playing-Card-Illustration-by-Jonathan-Burton.jpg");
  ImageManagerObject.LoadCard("http://photos.pokerplayer.co.uk/images/front_picture_library_UK/dir_1/total_gambler_916_15.jpg");
  ImageManagerObject.LoadCard("http://1.bp.blogspot.com/-wdHxCm6bFwE/TxBc-jVD1aI/AAAAAAAAEH0/CG6PIcG69H8/s1600/card6.png");
  ImageManagerObject.LoadCard("http://weandthecolor.com/wp-content/uploads/2013/02/5-Clubs-Playing-Card-Illustration-by-Jonathan-Burton.jpg");
  
  
  //Loads the bonus card faces. The ID's of these are important, as they needs to be used in Card.RunBonus();
  SCHWARTZID = ImageManagerObject.LoadCard("http://www.towergaming.com/images/media-room/articles/joker-card.png");
  POINTID = ImageManagerObject.LoadCard("http://static8.depositphotos.com/1035986/841/v/950/depositphotos_8416424-Joker-Clown-playing-cards-hubcap-focus-trick-circus-fun-lough.jpg");
  PAIRID = ImageManagerObject.LoadCard("http://www.bjwebart.com/qtr-fold_card_images/4_card_front_placed.jpg");
  CONFUSEID = ImageManagerObject.LoadCard("http://www.usgreencardoffice.com/uploads/images/usgco_liberty.jpg");
  
  //Loads the images for GFX
  POINTS1 = ImageManagerObject.LoadMisc("http://starship-games.com/500.png");
  POINTS2 = ImageManagerObject.LoadMisc("http://starship-games.com/500.png");
  
  //Creates the levemanager object. Giving it the amount of faces, and telling it that the amount of cards must never exceed 25 cards.
  LevelManagerObject.Create(ImageManagerObject.Faces.length,25);
  
  
  for (var i = 0; i < 25; ++i){
	  //Generate unique ID for the card
	  var name = "Card_"+i;
	  var nameImg = "Img_"+i;
	  $("#Cards").append("<div id='"+name+"' style='position: absolute; width: 208; height: 208;'></div>");
	  $("#"+name).append("<img id='"+nameImg+"' draggable='false' class='image'/>");
    $("#"+name).hide();
  }
  
  $("#inputBox").focus();
  $(".GoToHighScore").click(function(e) {
    Name = document.getElementById("inputBox").value;
    if (Ended == 1){
      //If we are entering our name show the highscore
      $("#NameEnterHUD").hide();
    
      //Send the highscore to the database.
      ShowHighscore();
      ApplyHighscore( {name: Name, score: Points} );
    }
    else if (Ended == 2){
    //Else, restart the game.
    Restarted = true;
    RestartGame();
    }
  });
  
  
  //Setup UI
  //Add borders.
  $("#ButtonPause").click(function(e) { PauseGame() });
  $("#ButtonMuteSound").click(function(e) { MuteSound() });
  $("#ButtonMuteMusic").click(function(e) { MuteMusic() });
  $("#MessageButton").click(function(e) { UnshowMessage() });
  
  current = $('#PointHUD');
  current.html("Points: "+Math.round(PointsVisual));

  Scores = new Array();
  Scores.sort(CustomSort);

  /**
   * Starts the game. Much of it is actually gamequery specific code.
   */
  $("#ButtonStartGame").click(function(){
      Then = new Date().getTime();
      GameStart = true;
      $("#inputbox").show();
      
      //Create the first level.
      CreateLevel();
      //no Background music if iPad
      if (AppleDetect[0,0] != "iPad" || AppleDetect[0,0] != "Macintosh" || AppleDetect[0,0] != "iPhone" || AndroidDetect[0,0] != "Android"){
        BackgroundMusic.play( createjs.Sound.INTERRUPT_NONE, 0, 0, 1)
      }
      $("#welcomeScreen").remove();
  });
  
  //Sets up the main loop to be runnable.
  (function() {
    var onEachFrame;
    if (window.webkitRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); webkitRequestAnimationFrame(_cb); }
      _cb();
    };
    } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); mozRequestAnimationFrame(_cb); }
      _cb();
    };
    } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
    }
    window.onEachFrame = onEachFrame;
  })();
  
  
  
  //Change this and lines: 636-681, to change the UI.
  //var BackgroundImage = ImageManagerObject.LoadMisc("BG.png");
    
  //Sets the amountn of bonus cards loaded.
  BONUSES = 4;

  //Check what kind of eventlisteners the browser supports. and apply them the correct way.
  /*if(!window.addEventListener)
  {
    window.attachEvent("focus", function(event){} );
    window.attachEvent("blur", function(event){} );
  }
  else
  {
    window.addEventListener("focus", function(event)
    {
        ResumeGame();
      }, false);
      window.addEventListener("blur", function(event)
      {
        PauseGame();
    }, false);
  }*/

  /**
  * This function shows a message, with the proper css.
  *
  * @param string Message
  * The message for the user
  *
  * @param string ButtonMessage
  * The text on the button
  */
  function ShowMessage(Message, ButtonMessage) {
    //Tell the game it is currently showing a message to pseudo-pause it.
    ShowingMessage = true;
    
    //Append the needed containers.
    $("#MessageHUD").show();
    $("#BlurEffect").show();
    $("#MessageButton").show();
    
    
    Current = $("#MessageHUD");
    //Apply the string to the div, scale it, and then recenter it.
    Current.html(Message+"<br/><br/>");
      
    scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
  }

  /**
  * Unshows the message, basicly, this should only be called by the Ok button.
  */
  
  function UnshowMessage(Message) {
    ShowingMessage = false;
    
    $("#MessageHUD").hide();
    $("#BlurEffect").hide();
    
  }

  /**
  * This functions "creates a level" this function is run when there is an empty screen to set up
  * everything for the next level.
  */
  function CreateLevel() {
    //First go to next level to increase the difficulty.
    LevelManagerObject.NextLevel();
    
    // Resets clock.
    Then = new Date().getTime();
    CurrentGameTime = CoreGameTime;
    
    // Level goes up or Restarts
    if(Restarted == false) {
      CurrentLevel++;
    }
    else {
      CurrentLevel = 1;
    }
    
    //Updates the HUD values.
    current = $("#LevelHUD");
    current.html("Level: "+CurrentLevel);
    
    
    current = $("#TimeHUD");
    current.html("Time: "+Math.ceil(CurrentGameTime/1000));
    
    //Since the amount of cards has changed, calls the resized function.
    Resized();
    
    //Setup Card data so they can be reached randomly
    var CardDataArray = new Array();
    var CardDataArrayTwo = new Array();
    Turned = 0;
    var TurnedMax = 2;
    
    /**
    * This will ensure that two cards of each are added to the deck
    * This will then be fed to the Deckmanager.
    */
    for (var i = 0; i < LevelManagerObject.NumberOfCards; ++i){
      CardDataArray[i] = Math.floor(i/2);
    };
    
    
    /**
    * This will ensure that bonus cards are added to the stage.
    * This will then be fed to the Deckmanager.
    */
    for (var i = 0; i < LevelManagerObject.NumberOfCardsBonus; ++i){
      CardDataArrayTwo[i] = DeckManagerObject.GetRandomBonus();
    };
    
    
    //Creates the Deckmanager for this level.
    DeckManagerObject.Create(CardDataArray, CardDataArrayTwo);
    
    /**
    * In this stage we spawn the actual cards, right now this is a huge function.
    * Imagemanager and deckmanager will make this function a lot smaller.
    */
    for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i){
      //Generate unique ID for the card
      var name = "Card_"+i;
      
      NextCard = DeckManagerObject.PushCard();

      console.log(NextCard);
        
      //Add the actual card to the playground, we spawn them in a responsive way based on the resolution of the game.
      $("#Img_"+i).load(function() {
        $(this).parent().width($(this).width());
      });
      $("#Img_"+i).attr("src", ImageManagerObject.GetBack());
      $("#"+name).css({left: (i%(Math.ceil(NumberOfCards))) *SpaceX + SpaceX - 104 + LastYOff * ( i>= (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) - ((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus)%(Math.ceil(NumberOfCards))) ) , top: Math.floor( i / (Math.ceil(NumberOfCards)) ) * SpaceY + SpaceY - 152 });

      //Create the actual class for the card, this will add logic to the object.
      var Current = $("#"+name)[0];

      Current.Cards = new Cards($("#"+name), $("#Img_"+i), CARDSIZEX, CARDSIZEY);
      Current.Cards.Create(NextCard, ImageManagerObject.GetCard(NextCard), ImageManagerObject.GetCard(SCHWARTZID), ImageManagerObject.GetBack(), DeckManagerObject.LastBonus(), Scale);
      $("#"+name).show();
      
      /**
      * Add a mousedown event for the card, this mousedown will be run in the main
      * environment rather than the class environment to make sure that we have access
      * to all the data we need access to.
      */
      
      $("#"+name).mousedown(function(e){
        //Finds pit how many cards have already been turned around, so you can't turn more than 2
        var Ready = 0;
        ForEachCard(function() {
          if (this.Cards.visible && (this.Cards.Turning==true || this.Cards.FlippedVisual==true)){
            Ready++;
          }
        });
          
        //Check if this card is eligible for being turned.
        if (this.Cards.visible==true && this.Cards.Flipped == false && this.Cards.Turning == false
        && Ready<TurnedMax && !Done){
          //Run the clicked event for the card, this will start events etc.
          this.Cards.Clicked();
          /**
          * Increase the turned counter, if we have turned the correct amount of cards to be compared
          * then compare them.
          */
          if (this.Cards.Bonus == false){
            Turned++;
            //Check if the AutoComplete bonus card is currently in effect
            if (AutoComplete){
              //End the effect and save the card for comparison
              AutoComplete = false;
              var Card = this.Cards;
              
              var Someflip=false;
              ForEachCard(function(){
                //Find a card that is not flipped and has the same value, and then simulate that it is clicked.
                if (this.Cards.Flipped==false && Someflip==false && this.Cards.value == Card.value) {
                  this.Cards.node.mousedown();
                  Someflip = true;
                }
              });
            }
            else
            if (Turned==TurnedMax){
            /**
            * We have turned the amount of cards needed
            * Find out which value the first card has, and use this as a base to compare if cards match.
            * Also instantiate a counter for the amount of cards actually matching.
            * It's done this way if you want a variable number of cards needed for a match.
            */
              var Correct = this.Cards.value;
              var CorrectAmount = 0;
              ForEachCard(function(){
              /**
              * For each card, if they are flipped, are not going into hiding/deletion, and has the
              * Correct value, increase the counter for the number of cards matching.
              */
                if (this.Cards.Flipped == true && this.Cards.Hiding==0 && this.Cards.value == Correct)
                  CorrectAmount++;
                
              });
              
              //If we have a correct match
              if (CorrectAmount==TurnedMax){
                ForEachCard(function(){
                  //Foreach card that is flipped and not in hiding, delete them (aka. yay, you got a match).
                  if (this.Cards.Flipped==true && this.Cards.Hiding==0){
                    //This is per card in the matched stack.
                    if (this.Cards.Bonus == false)
                    Points+=100;
                    this.Cards.SetVisible(false);
                  }
                });
              }
              
              ForEachCard(function(){
                //Foreach card that was not in hiding and was not part of the match, unflip them again.
                if (this.Cards.Flipped==true && this.Cards.Hiding==0)
                this.Cards.Hide();
              });
              
              //Set the amount of cards to turned, since they have all been unturned at this point.
              Turned=0;
            }
          }
        }
      });
    }
  }
 

  /**
   * Resizing Event
   */
  function Resized(){  
    //Calculates the screen ratio, so we can organize the deck in a manner that makes sense to the ratio.
    Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
    Ratio = (Ratio+1)/2;
    
    /**
    * Gets the square root of the number of cards. This is because we would attempt to make a square, should the
    * ratio be 1:1
    */
    NumberOfCards = Math.sqrt(LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus);
    
    /**
    * Calculates how much space there needs to be in between each card to make a proper layout.
    * It will add to extra empty rows, to make room for UI.
    * Calulate number of rows based on ratio.
    */
    SpaceY = PLAYGROUND_HEIGHT/(Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) , Math.ceil( (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) / ((Math.ceil(NumberOfCards*Ratio ))) ) + 1));
    
    //Now recalculate NumberOfCards, so it will make a more even distribution of the cards, based on the amount of rows it has.
    NumberOfCards = (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus)/(Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) , Math.ceil( (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) / ((Math.ceil(NumberOfCards*Ratio )))    ) ));
    
    //Calculate the number of columns based on the new even distribution.
    SpaceX = PLAYGROUND_WIDTH/ Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) ,Math.ceil(NumberOfCards + 1));
    
    
    LastYOff = 0;
    
    /**
    * If there is an uneven amount of cards at the last column, it will calculate the offset to center that column
    * Specifically
    */
    if (Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1),Math.ceil(NumberOfCards + 1)) != Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) , Math.ceil( (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) % ((Math.ceil(NumberOfCards ))) ) + 1)){
      LastYOff = (Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) ,Math.ceil(NumberOfCards + 1)) - Math.min((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus + 1) , Math.ceil( (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) % ((Math.ceil(NumberOfCards ))) ) + 1))/2 * SpaceX;
    }
    
    /**
    * Now, if check if the calculated spacing on X is large enough so that hte card can be drawn, if not, calculate
    * How much the card needs to be scaled down.
    */
    if (SpaceX >= CARDSIZEX+EMPTYSPACE){
      Scale1 = 1;
    }
    else{
      Scale1 = SpaceX/(CARDSIZEX+EMPTYSPACE);
    }
    
    //Do the same for Y
    if (SpaceY >= CARDSIZEY+EMPTYSPACE){
      Scale2 = 1;
    }
    else{
      Scale2 = SpaceY/(CARDSIZEY+EMPTYSPACE);
    }
    
    //Now choose the lesser of the scalings, because this one will be the one to actually be applied.
    Scale = Math.min(Scale1, Scale2);
    
    /**
     * Could possibly use foreachcard, it's hard to handle uninitialized variables in foreachcard though.
     * Finds all cards, if they exist, updates their position and scaling. 
     */
    for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i){
      var Card = $("#Card_"+i)
      
      if (Card.length>0 && Card[0].Cards){
      Card[0].Cards.scale = Scale;
      $(Card).css({left: (i%(Math.ceil(NumberOfCards))) *SpaceX + SpaceX - 104 + LastYOff * ( i>= (LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus) - ((LevelManagerObject.NumberOfCards + LevelManagerObject.NumberOfCardsBonus)%(Math.ceil(NumberOfCards))) ), top: Math.floor( i / (Math.ceil(NumberOfCards)) ) * SpaceY + SpaceY - 152})
      $(Card).show();
       }
    }
    
    //Calculate how much space is in between hte buttons.
    ButtonSpace=Math.floor(PLAYGROUND_WIDTH-20)/3;
    
    
    //Recalculate scale to use for background scaling, and then scale the background.
    //scale = Math.max(PLAYGROUND_WIDTH/BACKGROUNDSIZE.x, PLAYGROUND_HEIGHT/BACKGROUNDSIZE.y);
    //$("#Background").scale(scale);
    //$("#Background").xy(BACKGROUNDSIZE.x*(scale-1)/2 - (BACKGROUNDSIZE.x*scale - PLAYGROUND_WIDTH)/2,(BACKGROUNDSIZE.y*(scale-1))/2 - (BACKGROUNDSIZE.y*scale - PLAYGROUND_HEIGHT)/2);
    
    //TODO MOVE TO .CSS

    //Current = $("#RealBG");
	  //Current.css({width: Current.width()*scale,height: Current.height()*scale,  left: BACKGROUNDSIZE.x*(scale-1)/2 - (BACKGROUNDSIZE.x*scale - PLAYGROUND_WIDTH)/2, top: (BACKGROUNDSIZE.y*(scale-1))/2  - (BACKGROUNDSIZE.y*scale - PLAYGROUND_HEIGHT)/2});
  }

  /**
  * Function to end the game
  */
  function EndGame(){
    //Correct the variables, and create a div to store the screen to enter your name.
    Ended = 1;
    Name = "";

    $("#NameEnterHUD").show();
    //Blurs the background.
    $("#BlurEffect").show();

    
    //Generate a string based on the name varaible, which is changed in onkeypress
    //var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
    //var string = "Du har nok point til at komme på highscoren<br> Skriv venligst dit navn";
    
    //If on an ipad, create a full-screen textbox and focus it, to bring up hte keyboard.
    //if (AppleDetect[0,0] == "iPad" || AppleDetect[0,0] == "Macintosh" || AppleDetect[0,0] == "iPhone" || AndroidDetect[0,0] == "Android"){
     //TODO Comment
      /*FocusFunction = function(me){
        $(me).height(0);
      Focused = true;
      }
      //TODO Comment
      UnfocusFunction = function(me){
      $(me).height(PLAYGROUND_HEIGHT);
      Focused = false;
      }*/
      
      //$("#inputbox").append("<div id='inputHUD'><input id ='inputBox' onfocus='FocusFunction(this)' onblur='UnfocusFunction(this)' autocorrect='off' type = 'text'></div>");
      //$("#inputbox").append("<div id='inputHUD'><input id ='inputBox' autocorrect='off' type = 'text'></div>");
     
    //}
    //var Current = $("#NameEnterHUD");
    //Apply the string to the div, and recenter it.
    //Current.html(string);
      //$("#NameEnterHUD").append("<div id='inputHUD'><input id='inputBox' type = 'text' /></div>");

     // Name = document.inputBox.value
    //Delete all cards currently on the field.
    for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i){
      $("#Card_"+i).hide();
    }
  }

  /**
  * Remove the highscore screen, and start the game from scratch.
  */

  function RestartGame(){
    $("#HighscoreHUD").hide();
    $("#inputHUD").hide();
    //$("#inputBox").hide();
    
    //Reset loaded scores.
    Scores = new Array();
    
    //Remove the blur effect
    $("#BlurEffect").hide();
    
    //Reset all important varaibles.
    Points = 0;
    PointsVisual = 0;
    Ended = 0;
    CurrentGameTime = CoreGameTime;
    //This is the easiest way to reset the levelmanager.
    LevelManagerObject.Create(ImageManagerObject.Faces.length*2,25);
    //Create the first level against.
    CreateLevel();
  }

  /**
  * Function to show highscore
  */
  function ShowHighscore(){
    if (Ended!=1){
      /**
      * If we were not send from name entering screen, delete all objects first
      * Delete all cards currently on the field.
      */
      for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i){
        $("#Card_"+i).hide();
      }
      $("#BlurEffect").show();
    }
    Ended=2;
    //Create the div for the highscore.
    //Line = "<p id='HighscoreHeadline'>Highscore</p><br>";
    Line = "";
    
    //Load the highscores from localstoage, and split them into an array.
    SplitScores = localStorage.LocalStorageScores.split(" ");
    if (SplitScores.length>1){
      for(i=0;i<(SplitScores.length-1)/2;i++){
        //Loop through the array to put all the scores into the appropriate array.
        Scores[i]={name: SplitScores[i*2], score: SplitScores[i*2+1]};
      }
    }
    
    var LineBool = true;
    //Create a line containing the 10 best scores, and apply them to the div.
    $.get('http://www.starship-games.com/GetHighscore.php', {} , function(data) {
      //This code runs when the scores are loaded, and they need to be reformatted.
      //TODO: Remove if online highscore is not needed.
      for (i=0; i<Math.min(10, Scores.length); i++){
        //Create the html text, based on the loaded scores. if we are within the 3 first entries, make them bigger.
        /*if (i<3){
        LineTextSize = 100+35/(i+1);
        }
        else{*/
          LineTextSize = 100;
        /*}*/
        if (i % 2 == 0){
          Line+="<p id='Highscore0'>"+(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"</p>";
        }
        else{
          Line+="<p id='Highscore1'>"+(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"</p>";
        }
      }
      $("#Lines").html(Line);
      
      Current = $("#Lines");
    }, 'json');
    
    
    //Create new div for high score.
    $("#HighscoreHUD").show();
    $("#inputHUD").show();
    $.ajax({
      data: "Name=" + Name + "&Score=" + Points,
      type: "POST",
      url: "http://www.starship-games.com/PostHighscore.php",
      complete: function (data){
      }
    });
    
    //set some basic html until the data has been loaded.
    //$("#HighscoreHUD").html(Line+"<hr><br><p id='HighscoreFooter'>Tryk Enter for at starte et nyt spil</p>");
    
    //Current = $("#HighscoreHUD");
  }

  /**
   * This is called with an object containing name and score, can be used to send to the database.
   *
   * @param object object
   * An object with scores
   */
  function ApplyHighscore(object){
    //Places the score in the array for the highscore
    Scores[Scores.length] = object;
    Scores.sort(CustomSort);
    
    // Applies the scores to local storage
    StringScores = "";
    
    for(i=0;i<Scores.length;i++){
      //Creates a string for the scores so they can be used for localstorage
      StringScores += Scores[i].name + " " + Scores[i].score + " ";
    }
    localStorage.LocalStorageScores = StringScores;
  }

  /**
  * Resets the highscore with standard scores.
  */
  function ResetHighscore(){
    //Resets the highscore to a default value. This also creates local highscores for players to beat. May need to revise the scores a bit.
    localStorage.LocalStorageScores = "Nicolaus 10000 Swartz 9000 Julie 8000 Peter 7000 Signe 6000 Regitze 5000 Susanne 4000 Chris 3000 Sander 2000 Emil 1000 ";
  }
  
  Step = function(){
    //Calcualte how many miliseconds passed since last frame, to get smoother animations.
    Now = new Date().getTime();
    Delta = Now - Then;
    if (GameStart && !Paused && !ShowingMessage){
      if (Ended == 2){
      var Current = $("#HighscoreHUD");
      /**
      * If we are showing the highscore, center the highscore on the screen each frame, in case the resolution changes.
      */
      //Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top: (PLAYGROUND_HEIGHT - Current.height() - 60)/2});
      }
      else if (Ended == 1){
        //TODO: DO IT USING KEYPRESSES HOPEFULLY
        if (AndroidDetect[0,0] == "Android"){
          Name = $("#inputBox").val();
        }
        /**
        * If we are entering our name:
        * Generate a string based on the name varaible, which is changed in onkeypress
        */
        //var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
        //var string = "Du har nok point til at komme på highscoren<br> Skriv venligst dit navn";
        //var Current = $("#NameEnterHUD");
        //Apply the string to the div.
        //Current.html(string);
        
        ForEachGFX(function(){
          //For each card, perform their step event.
          this.GFX.Despawn();
        });
      }
      else{
        //Basic Game Engine!!
      
        //Resize time hud, because the values change while playing.
        current = $("#TimeHUD");
        current.html("Time: "+Math.ceil(CurrentGameTime/1000));
      
      
        ForEachCard(function(){
          //For each card, perform their step event.
          this.Cards.Step();
        });
      
        ForEachGFX(function(){
          //For each GFX, perform their step event.
          this.GFX.Step();
        });
        //Ends game if GameTime hits 0
        if (CurrentGameTime <= 0){
          $("#TimeHUD").html("Time: 0");
          EndGame();
        }
      
        //Calculate how many cards has been matched.
        var Turned = 0;
        ForEachCard(function(){
          if (this.Cards.visible == false && this.Cards.Bonus==false)
          Turned++;
        });
      
        //Count down the game time. but only once the game has started
        if(GameStart = true){
          if (Turned < LevelManagerObject.NumberOfCards)
          CurrentGameTime= CurrentGameTime-Delta;
        }
      
        //If we have matched all the cards.
        if (Turned >= LevelManagerObject.NumberOfCards){
          DoneTimer+=Delta;
          Done = true;
        
          //if Leveldiv does not exist, create it and show the next level we get to.
          if (HasStartedLevelTransition==false){
            ForEachCard(function(){
              this.Cards.node.fadeOut();
            });
          
            $("#Leveldiv").show();
            $("#Leveldiv").html("Level: "+(CurrentLevel+1));
            HasStartedLevelTransition=true;
          }
          //Current = $("#Leveldiv");
          //Current.css({left: PLAYGROUND_WIDTH/2-Current.width()/2-30, top: PLAYGROUND_HEIGHT/2-Current.height()/2-30});
        
          //If done, count the timer up to create a delay before next level.
          if (DoneTimer>1500){
            //About 0.5 seconds before creating next level, fade it out.
            $("#Leveldiv").fadeOut();
          }
        
          if (DoneTimer>2000){
            DoneTimer=0;
            Points+=Math.round(CurrentGameTime/100) + CurrentLevel * 100;
            Done = false;
            //Once done, reset the control variables, and remove all cards.
            for (var i = 0; i < LevelManagerObject.NumberOfCards+LevelManagerObject.NumberOfCardsBonus; ++i){
              //$("#Card_"+i).remove();
            }
          
            //Then create next level.
            Restarted = false;
            HasStartedLevelTransition = false;
            $("#Leveldiv").hide();
            CreateLevel();
          }
        }
      }
    }
  
    //Reset then, so that we can calculate delta-time next frame.
    Then = Now;
  
    //Counts the points up, The further away they are, the more they will count up.
    if (PointsVisual<Points)
    {
      PointsVisual+=((Points - PointsVisual)/300+0.33) * (Delta);
    
      //Make sure they don't count up too much.
      if (PointsVisual>Points){
        PointsVisual=Points;
      }
    }
  
    EndedLaster=Ended;
    //Loop
  }
  
  //Starts the main loop
  window.onEachFrame(Step);

  /**
  * This function is used for the loading spinner.
  * We have little idea how it works.
  */
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
