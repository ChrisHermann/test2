/**
 * @file
 * The this file is main javascript file
 */

// Global constants:
var PLAYGROUND_WIDTH    = 1000;
var PLAYGROUND_HEIGHT    = 1000;
var REFRESH_RATE        = 30;

var percent = 1;

Paused = false;
var MMusic = false;
var MSound = false;

/**
 * Global function that applies a function to all cards.
 * We avoid $("#Card").each because it's very slow in ie8.
 *
 * @param function Function
 *   explain @Sander
 */
function ForEachCard(Function)
{
  for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
  {
    Function.apply($("#Card_"+i)[0]);
  }
}

/**
 * Similar to ForEachCard, but with all GFX cards.
 * 
 * @param function Function
 * explain @Sander
 */
function ForEachGFX(Function)
{
  for (var i = 0; i < GFXCount; ++i)
  {
    if ($("#GFX_"+i)[0])
    Function.apply($("#GFX_"+i)[0]);
  }
}

/**
 * This function pauses the game.
 */
function PauseGame()
{
  //Do not pause hte game before it has started, as this creates weird bugs.
  if(GameStart)
  {
    $.playground().pauseGame();
    soundBG.pause();
    Paused = true;
    
    $("#playground").append("<div id='ResumeBut'></div>");
    
    //Create a button, which is hten used to resume the game.
    myButton = document.createElement("input");
    myButton.type = "button";
    myButton.value = "Resume Game";
    myButton.id = "ButRG";
    Current = $(myButton);
    myButton.onclick = ResumeGame;
    placeHolder = document.getElementById("ResumeBut");
    placeHolder.appendChild(myButton);
    
    
    $("#ResumeBut").css('left', (PLAYGROUND_WIDTH/2-$("#ButRG").width()/2)+'px')
    $("#ResumeBut").css('top',( PLAYGROUND_HEIGHT/2-$("#ButRG").height()/2)+'px')
  }
}

/**
 * This function resumes the game after its been paused.
 */
function ResumeGame()
{
  //Don't run hte function if the game has not yet started, this creates weird bugs.
  if(GameStart)
  {
    //This is used to reset delta, so hte game thinks no time has passed between the pause.
    Then = new Date().getTime();
    $.playground().resumeGame();  
    soundBG.resume();
    Paused = false;
    $("#ResumeBut").remove();
  }
}

/**
 * Use this function to automatically alter between paused state and resumed state.
 */
function PauseResume()
{
  if (Paused == false)
    PauseGame();
  else
    ResumeGame();
}

/**
 * This function has two functions to mute and unmute music. It will detect what the music currently is, and do the opposite.
 */
function MuteMusic()
{
  if (ppDetect[0,0] != "iPad" || ppDetect[0,0] == "Macintosh" || ppDetect[0,0] == "iPhone" || pppDetect[0,0] == "Android")
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
  
    //This is the actual call.
    if(MMusic == false)
      MuteMusic();
    else
      UnMuteMusic();
  }
}

/**
 * This function has two functions to mute and unmute Sound. It will detect what the music currently is, and do the opposite.
 */
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
  
  //This is the actual call.
  if(MSound == false)
    MuteSound();
  else
    UnMuteSound();
}

  /**
   * a lot of browser detect code see http://www.quirksmode.org/js/detect.html
   * Essentially, what it does is find four strings: 
   * It searches through the string returned by the browser and generates various substrings which can be used to identify the browser.
   * The most important ones are dataBrowser.identity and dataOS.identity.
   */
  
  var BrowserDetect = 
{
  init: function () 
  {
    this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
    this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
    this.OS = this.searchString(this.dataOS) || "an unknown OS";
  },
  searchString: function (data) 
  {
  for (var i=0;i<data.length;i++)
  {
    var dataString = data[i].string;
    var dataProp = data[i].prop;
    this.versionSearchString = data[i].versionSearch || data[i].identity;
    if (dataString)
    {
    if (dataString.indexOf(data[i].subString) != -1)
      return data[i].identity;
    }
    else if (dataProp)
    return data[i].identity;
  }
  },
  searchVersion: function (dataString)
  {
    var index = dataString.indexOf(this.versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
  },
  dataBrowser:
  [
    {
      string: navigator.userAgent,
      subString: "Chrome",
      identity: "Chrome"
    },
    {   string: navigator.userAgent,
      subString: "OmniWeb",
      versionSearch: "OmniWeb/",
      identity: "OmniWeb"
    },
    {
      string: navigator.vendor,
      subString: "Apple",
      identity: "Safari",
      versionSearch: "Version"
    },
    {
      prop: window.opera,
      identity: "Opera",
      versionSearch: "Version"
    },
    {
      string: navigator.vendor,
      subString: "iCab",
      identity: "iCab"
    },
    {
      string: navigator.vendor,
      subString: "KDE",
      identity: "Konqueror"
    },
    {
      string: navigator.userAgent,
      subString: "Firefox",
      identity: "Firefox"
    },
    {
      string: navigator.vendor,
      subString: "Camino",
      identity: "Camino"
    },
    {    // for newer Netscapes (6+)
      string: navigator.userAgent,
      subString: "Netscape",
      identity: "Netscape"
    },
    {
      string: navigator.userAgent,
      subString: "MSIE",
      identity: "Explorer",
      versionSearch: "MSIE"
    },
    {
      string: navigator.userAgent,
      subString: "Gecko",
      identity: "Mozilla",
      versionSearch: "rv"
    },
    {     // for older Netscapes (4-)
      string: navigator.userAgent,
      subString: "Mozilla",
      identity: "Netscape",
      versionSearch: "Mozilla"
    }
  ],
  dataOS :
  [
    {
      string: navigator.platform,
      subString: "Win",
      identity: "Windows"
    },
    {
      string: navigator.platform,
      subString: "Mac",
      identity: "Mac"
    },
    {
      string: navigator.userAgent,
      subString: "iPhone",
      identity: "iPhone/iPod"
    },
    {
      string: navigator.platform,
      subString: "Linux",
      identity: "Linux"
    }
  ]
};
BrowserDetect.init();

/**
 * segmenting the platform info
 * p & b, platform & browser detect.
 */
var pTemp = navigator.appVersion;
pTemp = pTemp.split(" ");
var bDetect = BrowserDetect.browser + BrowserDetect.version;
var bbDetect = BrowserDetect.browser;
var pDetect = pTemp[0,1] + " " + pTemp[0,0];
pDetect = pDetect.substring(1);
ppDetect = pDetect.split(";");
pppDetect = pDetect.split(")");


// if Explorer 8 DO...
if(bDetect == "Explorer8" )
{
  //Not necessary right now.
}
// if iProduct DO...
else if(ppDetect[0,0] == "iPad" ||  ppDetect[0,0] == "Macintosh" || ppDetect[0,0] == "iPhone")
{
  //Not necessary right now.
}

/** 
 * --------------------------------------------------------------------
 * --                      the main declaration:                     --
 * -------------------------------------------------------------------- 
 */

/**
 * This game uses gamequery. The documentation for this can be found at:
 * http://gamequeryjs.com/documentation/
 * It is purely made in the DOM and as such does not use canvas at all.
 */
 
 $(function(){
  document.body.style.overflow = "hidden";
  //Calculate playground width and height:
  PLAYGROUND_WIDTH = $(window).width();
  PLAYGROUND_HEIGHT = $(window).height();
  var UISIZEY = 170;
  

 
  /**
   * Custom sorting function, so the array knows to sort based on an attribute.
   */
  function CustomSort(a,b)
  {
    return(b.score-a.score);
  }

  //Calculate playground width and height:
  PLAYGROUND_WIDTH = $(window).width() - 20;
  PLAYGROUND_HEIGHT = $(window).height() - 20;
  
  $("#spin").css('left', PLAYGROUND_WIDTH/2+'px')
  $("#spin").css('top', (PLAYGROUND_HEIGHT/2-120)+'px')
  
  //Initiates a default highscore if there is none.
  if(!localStorage.LocalStorageScores)
  {
    ResetHighscore();
  }
  
  //Create a button to start the game with.
  myButton = document.createElement("input");
  myButton.type = "button";
  myButton.value = "Start Game";
  myButton.id = "ButSG";
  Current = $(myButton);
  myButton.onclick = StartGame;
  placeHolder = document.getElementById("startbutton");
  placeHolder.appendChild(myButton);
  
  
  //Resize and center the div on the screen.
  $('#ButSG').width(160);
  $('#ButSG').height(44);
  $("#startbutton").css('left', (PLAYGROUND_WIDTH/2-$("#ButSG").width()/2)+'px');
  $("#startbutton").css('top', (PLAYGROUND_HEIGHT/2-$("#ButSG").height()/2)+'px');
  $('#ButSG').css('font-size', 21+'px');
  

  //Sets up all the variables needed for the game to run.
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
  var HSLines;
  var ShowingMessage = false;
  var ScaleUI = 0;
  var Focused = false;
  GFXCount = 0;
  Points = 0;
  PointsV = 0;
  Autocomplete = false;
  Restarted = false;
  
  Now = 0;
  
  Delta = 0;
  
  Then = new Date().getTime();
  
  
  var CoreGameTime = 1 * 1000;
  
  var CurGameTime = CoreGameTime;
  
  GameStart = false;
  
  
  var LastA=false;
  var LastP=false;
  var LastO=false;

  //Cahnge this if image resolution changes
  var CardSize = {x: 208,y: 303};

  CoreLevel = 0;
  
  CurLevel = CoreLevel;
  
  
  /**
   * Animations declaration: 
   * The background:
   */   
  var DM = new DeckManager();
  IM = new ImageManager();
  LM = new LevelManager();
  
  //Creates the imagem anager and loads the backcard.
  IM.Create("http://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Card_back_01.svg/208px-Card_back_01.svg.png");
  
  
    
  /**
   * Sounds
   * no bg music on iPad
   */
  if (ppDetect[0,0] != "iPad" || ppDetect[0,0] == "Macintosh" || ppDetect[0,0] == "iPhone")
  {
    soundBG = createjs.Sound.createInstance("./music.mp3");
   soundFlipCard = createjs.Sound.createInstance("./flipcard.wav");
  }
  
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
  
  
  //Loads the bonus card faces. The ID's of these are important, as they needs to be used in Card.RunBonus();
  SWARTZID = IM.LoadCard("http://www.towergaming.com/images/media-room/articles/joker-card.png");
  POINTID = IM.LoadCard("http://static8.depositphotos.com/1035986/841/v/950/depositphotos_8416424-Joker-Clown-playing-cards-hubcap-focus-trick-circus-fun-lough.jpg");
  PAIRID = IM.LoadCard("http://www.bjwebart.com/qtr-fold_card_images/4_card_front_placed.jpg");
  CONFUSEID = IM.LoadCard("http://www.usgreencardoffice.com/uploads/images/usgco_liberty.jpg");
  
  //Loads the images for GFX
  POINTS1 = IM.LoadMisc("http://starship-games.com/500.png");
  POINTS2 = IM.LoadMisc("http://starship-games.com/500.png");
  
  //Creates the levemanager object. Giving it the amount of faces, and telling it that the amount of cards must never exceed 25 cards.
  LM.Create(IM.Faces.length,25);
  
  
  //Change this and lines: 636-681, to change the UI.
  var BackI = IM.LoadMisc("BG.png");
    
  //Sets the amountn of bonus cards loaded.
  BONUSES = 4;  
  
  
  //Check what kind of eventlisteners the browser supports. and apply them the correct way.
  if(!window.addEventListener)
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
  }
  
  /**
   * This function shows a message, with the proper css.
   * 
   * @param string Message
   *   The message for the user
   * 
   * @param string ButtonMessage
   *   The text on the button
   */
  function ShowMessage(Message, ButtonMessage)
  {
    //Tell the game it is currently showing a message to pseudo-pause it.
    ShowingMessage = true;
    
    //Append the needed containers.
    $("#popup").append("<span id='MessageHUD'></span>");
    $("#blur").append("<div id='Blureffect' style='width: "+PLAYGROUND_WIDTH+"px; height: "+PLAYGROUND_HEIGHT+"px;'></div>");  
    
    //Add the control buttons to the UI
    myButton = document.createElement("input");
    myButton.type = "button";
    myButton.value = ButtonMessage;
    myButton.id = "MessageButton";
    Current = $(myButton);
    myButton.onclick = UnshowMessage;
    
    
    Current = $("#MessageHUD");
    //Apply the string to the div, scale it, and then recenter it.
    Current.html(Message+"<br/><br/>");
      
    scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
    
    placeHolder = document.getElementById("MessageHUD");
    placeHolder.appendChild(myButton);

    Current.css('font-size',scale*200+'%');
      
    scale = Math.min(1,PLAYGROUND_WIDTH/1100);
    if (Current.width()>800*scale)
    Current.width(800*scale);
    Current.css({left: (PLAYGROUND_WIDTH - Current.width()  - 60)/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
  }
  
  /**
   * Unshows the message, basicly, this should only be called by the Ok button.
   */
  function UnshowMessage(Message)
  {
    ShowingMessage = false;
    
    $("#MessageHUD").remove();
    $("#Blureffect").remove();
    
  }

    

  /**
   * This functions "creates a level" this function is run when there is an empty screen to set up
   * everything for the next level.
   */
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
    
    //Updates the HUD values.
    current = $("#LevelHUD");
    current.html("Level: "+CurLevel);
    
    
    current = $("#TimeHUD");
    current.html("Time: "+Math.ceil(CurGameTime/1000));
    
    //Since the amount of cards has changed, calls the resized function.
    Resized();
    
    //Setup Card data so they can be reached randomly
    var Vals = new Array();
    var Vals2 = new Array();
    Turned = 0;
    var TurnedMax = 2;
    
    /**
   * This will ensure that two cards of each are added to the deck
     * This will then be fed to the Deckmanager.
     */
    for (var i = 0; i < LM.NumberOfCards; ++i)
    {
      Vals[i] = Math.floor(i/2);
    };
    
    
    /**
   * This will ensure that bonus cards are added to the stage.
     * This will then be fed to the Deckmanager.
     */
    for (var i = 0; i < LM.NumberOfCardsBonus; ++i)
    {
      Vals2[i] = DM.GetRandomBonus();
    };
    
    
    //Creates the Deckmanager for this level.
    DM.Create(Vals, Vals2);
    
    /**
   * In this stage we spawn the actual cards, right now this is a huge function.
     * Imagemanager and deckmanager will make this function a lot smaller.
   */
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
      
      
      /**
     * Add a mousedown event for the card, this mousedown will be run in the main
       * environment rather than the class environment to make sure that we have access
       * to all the data we need access to.
       */
    $("#"+name).mousedown(function(e)
      {
        //Finds pit how many cards have already been turned around, so you can't turn more than 2
        var Ready = 0;
        ForEachCard(function()
        {
          if (this.Cards.visible && (this.Cards.Turning==true || this.Cards.FlippedV==true))
          {
            Ready++;
          }
        });
          
        //Check if this card is eligible for being turned.
        if (this.Cards.visible==true && this.Cards.Flipped == false  && this.Cards.Turning == false
        && Ready<TurnedMax && !Done)
        {
          //Run the clicked event for the card, this will start events etc.
          this.Cards.Clicked();
          /**
       * Increase the turned counter, if we have turned the correct amount of cards to be compared
           * then compare them.
       */
          if (this.Cards.Bonus == false)
          {
            Turned++;
            //Check if the autocomplete bonus card is currently in effect
            if (Autocomplete)
            {
              //End the effect and save the card for comparison
              Autocomplete = false;
              var Card = this.Cards;
              
              var Someflip=false;
              ForEachCard(function()
              {
                //Find a card that is not flipped and has the same value, and then simulate that it is clicked.
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
              /**
         * We have turned the amount of cards needed
               * Find out which value the first card has, and use this as a base to compare if cards match.
               * Also instantiate a counter for the amount of cards actually matching.
               * It's done this way if you want a variable number of cards needed for a match.
         */
              var Correct = this.Cards.value;
              var CorrectAmount = 0;
              ForEachCard(function()
              {
                /**
         * For each card, if they are flipped, are not going into hiding/deletion, and has the
                 * Correct value, increase the counter for the number of cards matching.
         */
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
              
              //Set the amount of cards to turned, since they have all been unturned at this point.
              Turned=0;
            }
          }
        }
      });
    }
  }
  
  
  
  var resizeTimer;

  /**
   * Event to handle resizing
   * This event should fire under any circimstance, except when safari is NOT maximized, and windows resolution is changed (WTF?)
   */
  $(window).resize(function () 
  {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(Resized, 1);
  });  

  /**
   * Actual Resizing Event
   */
  function Resized() 
  {  
    //Calculate playground width and height:
    PLAYGROUND_WIDTH = $(window).width();
    PLAYGROUND_HEIGHT = $(window).height();
    
    //Calculates the screen ratio, so we can organize the deck in a manner that makes sense to the ratio.
    Ratio = PLAYGROUND_WIDTH/PLAYGROUND_HEIGHT;
    Ratio =  (Ratio+1)/2;
    
    /**
     * Gets the square root of the number of cards. This is because we would attempt to make a square, should the
     * ratio be 1:1
     */
    noc = Math.sqrt(LM.NumberOfCards + LM.NumberOfCardsBonus);
    
    /**
     * Calculates how much space there needs to be in between each card to make a proper layout.
     * It will add to extra empty rows, to make room for UI.
     * Calulate number of rows based on ratio.
     */
    SpaceY = PLAYGROUND_HEIGHT/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    )  + 1));
    
    //Now recalulate noc, so it will make a more even distribution of the cards, based on the amount of rows it has.
    noc = (LM.NumberOfCards + LM.NumberOfCardsBonus)/(Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) / ((Math.ceil(noc*Ratio )))    ) ));
    
    //Calculate the number of columns based on the new even distribution.
    
    SpaceX = PLAYGROUND_WIDTH/ Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1));
    
    
    LastYOff = 0;
    
    /**
     * If there is an uneven amount of cards at the last column, it will calculate the offset to center that column
     * Specifically
     */
    if (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) !=  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))
    {
      LastYOff = (Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) ,Math.ceil(noc + 1)) -  Math.min((LM.NumberOfCards + LM.NumberOfCardsBonus + 1) , Math.ceil( (LM.NumberOfCards + LM.NumberOfCardsBonus) % ((Math.ceil(noc )))    )  + 1))/2 * SpaceX;
    }
    
    /**
     * Now, if check if the calculated spacing on X is large enough so that hte card can be drawn, if not, calculate
     * How much the card needs to be scaled down.
     */
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
    
    
    
    
    /**
     * Could possibly use foreachcard, it's hard to handle uninitialized variables in foreachcard though.
     * Finds all cards, if they exist, updates their position and scaling. 
     */
    for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
    {
      var Card = $("#Card_"+i)
      
      if (Card.length>0)
      {
      Card[0].Cards.scale = Scale;
      Card[0].Cards.Update({posx: (i%(Math.ceil(noc))) *SpaceX + SpaceX - 104 + LastYOff * (  i>=  (LM.NumberOfCards + LM.NumberOfCardsBonus) - ((LM.NumberOfCards + LM.NumberOfCardsBonus)%(Math.ceil(noc))) ) , posy: Math.floor( i / (Math.ceil(noc))  ) * SpaceY + SpaceY - 152 });
       }
    
    }
    
    //Calculate how much space is in between hte buttons.
    ButSpace=Math.floor(PLAYGROUND_WIDTH-20)/3;
    
    //Use this to calculate the UI.
    ScaleUI = Math.min((SpaceY - 10  - (CARDSIZEY+EMPTYSPACE)/2*Scale)/(UISIZEY + 10), Math.min(ButSpace/(320+20), 1), 1);
    
    $("#BorderTop").width(PLAYGROUND_WIDTH-20);
    
    $("#BorderTop").height(Math.floor(UISIZEY*ScaleUI));
    
    
    /**
     * Resizes the button, according to the variable ScaleUI.
     * Also centers them in the UI.
     */
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
    
    //Scales the pointHUD before everything else, this is used to properly calculate the TextScale.
    current = $('#PointHUD');
    current.width((PLAYGROUND_WIDTH-20)/3);
    
    //Append a textdiv which is used to test text-width, this is used to properly calculate the TextScale.
    $("#overlay").append("<div id='TextTestDiv' style='text-align:center; left: 0; top: 0;'></div>");
    Current = $("#TextTestDiv");
    Current.css("font-size", Math.floor(220* Math.min($('#PointHUD').width()/215, ScaleUI))+'%');
    Current.html("Points: "+Math.round(PointsV));
    var TextSize = Current.width();
    Current.remove();
    
    //Calculate the text size based on various factors.
    var TScale = Math.min($('#PointHUD').width()/215, ScaleUI);
    TScale*=Math.min($('#PointHUD').width()/(TextSize+10),1);
    
    
    //Now resize  the divs in hte UI, to the appropriate size, and re-center them.
    current = $('#PointHUD');
    current.css("font-size", Math.floor(220* TScale)+'%');
    current.css({ left: Math.floor((ButSpace*3+  10)-Math.floor(current.width()/2)- ButSpace/2) , top: 10});
    
    current = $("#TimeHUD");
    current.css("font-size", Math.floor(220* TScale)+'%');
    current.width((PLAYGROUND_WIDTH-20)/3);
    current.css({ left: Math.floor((ButSpace*2+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
    
    current = $("#LevelHUD");
    current.css("font-size", Math.floor(220* TScale)+'%');
    current.width((PLAYGROUND_WIDTH-20)/3);
    current.css({ left: Math.floor((ButSpace+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
    
    
    //Resize the startbutton, should that be present.
    if ($("#startbutton").length)
    {
      $('#ButSG').width(160);
      $('#ButSG').height(44);
      $("#startbutton").css('left', (PLAYGROUND_WIDTH/2-$("#ButSG").width()/2)+'px');
      $("#startbutton").css('top', (PLAYGROUND_HEIGHT/2-$("#ButSG").height()/2)+'px');
      $('#ButSG').css('font-size', 21*ScaleUI+'px');
    }
    
    //If HighscoreHUD exists
    if ($("#HighscoreHUD").length)
    {
      Current = $("#HighscoreHUD");
      
      //First, calculate hte scale, the numbers 1100 and 1400 are hardcoded.
      scale = Math.min(1,PLAYGROUND_WIDTH/1100, PLAYGROUND_HEIGHT/1400);
      //Adjusts the width. It can never be more than 50%, for various reasons.
      Current.width(Math.max(800*Math.min(0.5,PLAYGROUND_WIDTH/1100, PLAYGROUND_HEIGHT/1400+0.3) ));
      
      //Finds all the paragraphs and changes their textsize properly.
      for (i=0; i<=HSLines; i++)
      {
      if (i==0)
        $("#para_"+i).css('font-size',scale*150+'%');
      else
      if (i==HSLines)
        $("#para_"+i).css('font-size',scale*150+'%');
      else
      {
        if (i<3) 
        txtsz = 80+35/(i+1);
        else
        txtsz = 80;
        $("#para_"+i).css('font-size',scale*txtsz+'%');
      }
      
      }
      
      //Centers hte div on hte screen.
      Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height() - 60)/2});
    }
    
    //Of NameEnterHUD exists, scale it to the screen and resize it properly. Again 1100 is a hardcoded number.
    if ($("#NameEnterHUD").length)
    {
      Current = $("#NameEnterHUD");
      
      scale = Math.min(1,PLAYGROUND_WIDTH/1100);
      Current.width(800*scale);
      Current.css('font-size',scale*200+'%');
      Current.css({left: (PLAYGROUND_WIDTH - Current.width()  - 60)/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
    }
    
    //If Blureffect exists stretch it to fit the screen.
    if ($("#Blureffect").length)
    {
      Current = $("#Blureffect");
      
      Current.width(PLAYGROUND_WIDTH);
      Current.height(PLAYGROUND_HEIGHT);
    }
    
    //If inputhud exists, streacht it to the size of the screen.
    if ($("#inputHUD").length)
    {
	  if (!Focused)
	  {
        Current = $("#inputBox");
      
        Current.width(PLAYGROUND_WIDTH);
        Current.height(PLAYGROUND_HEIGHT);
	  }
    }
    
    //Recalculate scale to use for background scaling, and hten scale hte background.
    scale = Math.max(PLAYGROUND_WIDTH/BGSIZE.x, PLAYGROUND_HEIGHT/BGSIZE.y);
    $("#BG").scale(scale);
    $("#BG").xy(BGSIZE.x*(scale-1)/2 - (BGSIZE.x*scale - PLAYGROUND_WIDTH)/2,(BGSIZE.y*(scale-1))/2  - (BGSIZE.y*scale - PLAYGROUND_HEIGHT)/2);
  }
  
  //TODO: remove
    MuteMusic();
  /**
   * Function to end the game
   */
  function EndGame()
  {
    //Correct the variables, and create a div to store the screen to enter your name.
    Ended = 1;
    Name = "";

    $("#popup").append("<span id='NameEnterHUD'></span>");
    //Blurs the background.
    $("#blur").append("<div id='Blureffect' style='width: "+PLAYGROUND_WIDTH+"px; height: "+PLAYGROUND_HEIGHT+"px;'></div>");

    
    //Generate a string based on the name varaible, which is changed in onkeypress
    var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";
    
    //If on an ipad, create a full-screen textbox and focus it, to bring up hte keyboard.
	if (ppDetect[0,0] == "iPad" || ppDetect[0,0] == "Macintosh" || ppDetect[0,0] == "iPhone" || pppDetect[0,0] == "Android")
	{
	  FocusFunction = function(me)
	  {
	    $(me).height(0);
		Focused = true;
	  }
		
	  UnfocusFunction = function(me)
	  {
		$(me).height(PLAYGROUND_HEIGHT);
		Focused = false;
	  }
	  
	  $("#inputbox").append("<div id='inputHUD'><input id ='inputBox' onfocus='FocusFunction(this)' onblur='UnfocusFunction(this)' autocorrect='off' type = 'text' style='filter:alpha(opacity=00);  height:"+PLAYGROUND_HEIGHT+"px;width:"+PLAYGROUND_WIDTH+"px;'></div>");
		
	  Name = document.getElementById("inputBox").value;
	}
    var Current = $("#NameEnterHUD");
    //Apply the string to the div, and recenter it.
    Current.html(string);
    
    //Calculate scaling for the text size.
    scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
    
    Current.css('font-size',scale*200+'%');
  
    //Delete all cards currently on the field.
    for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
    {
      $("#Card_"+i).remove();
    }
    
    //Calculate scaling for the dic.
    scale = Math.min(1,PLAYGROUND_WIDTH/1100);
    Current.width(800*scale);
    Current.css({left: (PLAYGROUND_WIDTH - Current.width()  - 60)/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
  }
  
  /**
   * Remove the highscore screen, and start the game from scratch.
   */
	
  function RestartGame()
  {
    $("#HighscoreHUD").remove();
    $("#inputHUD").remove();
	$("#inputBox").remove();
    
    //Reset loaded scores.
    Scores = new Array();
    
    //Remove hte blur effect
    $("#Blureffect").remove();
    
    //Reset all important varaibles.
    Points = 0;
    PointsV = 0;
    Ended = 0;
    CurGameTime = CoreGameTime;
    //This is the easiest way to reset the levelmanager.
    LM.Create(IM.Faces.length*2,25);
    //Create the first level against.
    CreateLevel();
  }
  
  //If the browser is firefox, we need to run some special code for the key press events.
  if (bbDetect != "Firefox")
  {  
    //Used only when entering your name for the highscore.
    document.onkeypress = function(event)
    {
      var key_press = String.fromCharCode(event.keyCode);
      
      if (event.keyCode!=13 && key_press != " " && key_press != "<" && key_press != ">" && EndedL==1)
      Name += key_press;
    }
    
    //Used for highscore screens in general.
    $(document).keydown(function (e) {
      //alert('You pressed '+event.keyCode);
      //Delete chars when entering name
      if (e.which === 8)
      {
        //your custom action here
      
        Name = Name.substring(0, Name.length - 1);
        return false;
      }
      //Press enter to go to next screen.
      //var event = window.event || event;
      //var event = e;
      if (event.keyCode==13)
      {
        if (Ended == 1)
        {
          //If we are entering our name show the highscore
          //$("#HighscoreHUD").remove();
          $("#NameEnterHUD").remove();
          //Consider loading this earlier, possibly when starting the game, and than manually inserting the player score
          //both off.line and online.
          
          //Send the highscore to the database.
          ShowHighscore();
          ApplyHighscore( {name: Name, score: Points} );
        }
        else
        if (Ended == 2)
        {
        //Else, restart the game.
          Restarted = true;
          RestartGame();
        }
        
        
        return false;
      }
    });
  }
  else
  {
    //Delete chars when entering name
    $(document).keydown(function (e) {
      //FF needs event
      var event = e;
      var key_press = String.fromCharCode(event.keyCode);
      key_press = key_press.toLowerCase()
      if (e.which === 8)
      {
        Name = Name.substring(0, Name.length - 1);
        return false;
      }
      if (event.keyCode!=13 && key_press != " " && key_press != "<" && key_press != ">" && EndedL==1)
      {
        if (event.shiftKey)
          Name += key_press.toUpperCase();
        else
          Name += key_press;
      }
      //Press enter to go to next screen.
      if (event.keyCode==13)
      {
        if (Ended == 1)
        {
          //If we are entering our name show the highscore
          //$("#HighscoreHUD").remove();
          $("#NameEnterHUD").remove();
          //Consider loading this earlier, possibly when starting the game, and than manually inserting the player score
          //both off.line and online.
        
          //Send the highscore to the database.
          
          ShowHighscore();
          ApplyHighscore( {name: Name, score: Points} );
        }
        else
        if (Ended == 2)
        {
        //Else, restart the game.
          Restarted = true;
          RestartGame();
        }
        return false;
      }
      //event.preventDefault();
    });
  }
  
  /**
   * Function to show highscore
   */
  function ShowHighscore()
  {
    if (Ended!=1)
    {
      /**
	   * If we were not send from name entering screen, delete all objects first
       * Delete all cards currently on the field.
	   */
      for (var i = 0; i < LM.NumberOfCards+LM.NumberOfCardsBonus; ++i)
      {
        $("#Card_"+i).remove();
      }
      $("#blur").append("<div id='Blureffect' style='width: "+PLAYGROUND_WIDTH+"px; height: "+PLAYGROUND_HEIGHT+"px;'></div>");

    }
    Ended=2;
    HSLines=0;
    //Create hte div for the highscore.
    Line = "<p id='para_"+HSLines+"' id= style='padding: 0 30px; font-size: 200%;text-shadow: -4px -4px 0 #402A20, 4px -4px 0 #402A20, -4px 4px 0 #402A20,  4px 4px 0 #402A20, -3px -3px 0 #402A20, 3px -3px 0 #402A20, -3px 3px 0 #402A20,  3px 3px 0 #402A20, -2px -2px 0 #402A20, 2px -2px 0 #402A20, -2px 2px 0 #402A20,  2px 2px 0 #402A20, -1px -1px 0 #402A20, 1px -1px 0 #402A20, -1px 1px 0 #402A20,  1px 1px 0 #402A20;'>Highscore</p><br>";
    HSLines++;
    
    //Load the highscores from localstoage, and split them into an array.
    SplitScores = localStorage.LocalStorageScores.split(" ");
    var j = 0;
    if (SplitScores.length>1)
    for(i=0;i<(SplitScores.length-1)/2;i++)
    {
      //Loop through the array to put all the scores into the appropriate array.
      Scores[i]={name: SplitScores[j], score: SplitScores[j+1]};
      
      j+=2;
    }
    
    var n = true;
    //Create a line containing the 10 best scores, and apply them to the div.
    $.get('http://www.starship-games.com/GetHighscore.php', {} , function(data) {
      //This code runs when the scores are loaded, and they need to be reformatted.
      //TODO: Remove if online highscore is not needed.
      for (i=0; i<Math.min(10, Scores.length); i++)
      {
        //Create the html text, based on the loaded scores. if we are within the 3 first entries, make them bigger.
        if (i<3) 
          txtsz = 100+35/(i+1);
        else
          txtsz = 100;
        if (n)
          Line+="<p id='para_"+HSLines+"' style='background: #EAB344; padding: 7px 30px; font-size: "+txtsz+"%;'>"+(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"</p>";
        else
          Line+="<p id='para_"+HSLines+"' style='padding: 7px   30px; font-size: "+txtsz+"%;'>"+(i+1)+". "+Scores[i].name+" - "+Scores[i].score+"</p>";
        
        HSLines++;
        n = !n;
      }
      $("#HighscoreHUD").html(Line+"<hr style='color: #EAB344; background-color: #EAB344; height: 5px; border: 0;'><br><p id='para_"+HSLines+"' style='padding: 0 30px;'>Tryk Enter for at starte et nyt spil</p>");
      HSLines++;
      
      
      Current = $("#HighscoreHUD");
      
      //Calculate new scaling.
      scale = Math.min(1,PLAYGROUND_WIDTH/1100, PLAYGROUND_HEIGHT/1700);
      Current.width(800*scale);
      
      //Apply the correct scaling to the text in all the paragraphs.
      for (i=0; i<=HSLines; i++)
      {
        if (i==0)
          $("#para_"+i).css('font-size',scale*150+'%');
        else
        if (i==HSLines)
          $("#para_"+i).css('font-size',scale*150+'%');
        else
        {
          if (i<3) 
            txtsz = 80+35/(i+1);
          else
            txtsz = 80;
          $("#para_"+i).css('font-size',scale*txtsz+'%');
        }
        
      }
      
      //Center the div.
      Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
      
    }, 'json');
    
    //Create a scale for the text.
    //TODO: Remove
    scale = Math.min(1,Math.min(PLAYGROUND_WIDTH/Current.width(),PLAYGROUND_HEIGHT/Current.height()));
    
    
    //Create new div for high score.
    $("#popup").append("<div id='HighscoreHUD'></div>");  
    $("#inputbox").append("<div id='inputHUD'></div>");
    $.ajax
    ({
      data: "Name=" + Name + "&Score=" + Points,
      type: "POST",
      url: "http://www.starship-games.com/PostHighscore.php",
      complete: function (data) {
      }
    });
    
    //set some basic html until the data has been loaded.
    $("#HighscoreHUD").html(Line+"<hr style='color: #EAB344; background-color: #EAB344; height: 5px; border: 0;'><br><p id='"+HSLines+"' style='padding: 0 30px;'>Tryk Enter for at starte et nyt spil</p>");
    
    Current = $("#HighscoreHUD");
    
    //Calculate the div scale and apply it
    scale = Math.min(1,PLAYGROUND_WIDTH/1100, PLAYGROUND_HEIGHT/1700);
    Current.width(Math.max(800*Math.min(0.5,PLAYGROUND_WIDTH/1100, PLAYGROUND_HEIGHT/1400+0.3) ));
    
    //Apply the scaling to all paragraphs
    for (i=0; i<=HSLines; i++)
    {
      if (i==0)
        $("#para_"+i).css('font-size',scale*150+'%');
      else
      if (i==HSLines)
        $("#para_"+i).css('font-size',scale*150+'%');
      else
      {
        if (i<3) 
          txtsz = 80+35/(i+1);
        else
          txtsz = 80;
        $("#para_"+i).css('font-size',scale*txtsz+'%');
      }
      
    }
    
    //Center the div.
    Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height()-60)/2});
  }
  
  /**
   * This is called with an object containing name and score, can be used to send to the database.
   * 
   * @param object object
   *   An object with scores
   */
  function ApplyHighscore(object)
  {
    //Places the score in the array for the highscore
    Scores[Scores.length] = object;
    Scores.sort(CustomSort);
    
    // Applies the scores to local storage
    StringScores = "";
    
    for(i=0;i<Scores.length;i++)
    {
      //Creates a string for the scores so they can be used for localstorage
      StringScores += Scores[i].name + " " + Scores[i].score + " ";
    }
    localStorage.LocalStorageScores = StringScores; 
  }
  
  /**
   * Resets the highscore with standard scores.
   */
  function ResetHighscore()
  {
    //Resets the highscore to a default value. This also creates local highscores for players to beat. May need to revise the scores a bit.
    localStorage.LocalStorageScores = "Nicolaus 10000 Swartz 9000 Julie 8000 Peter 7000 Signe 6000 Regitze 5000 Susanne 4000 Chris 3000 Sander 2000 Emil 1000 ";
  }
  
  // Initialize the game:
  $("#playground").playground({
    height: PLAYGROUND_HEIGHT, 
    width: PLAYGROUND_WIDTH, 
    keyTracker: true,
  mouseTracker: true});

  // Initialize the background
  //TODO: Make it on long chain of groups?
  $.playground()
    .addGroup("background", {width: PLAYGROUND_WIDTH, 
                                 height: PLAYGROUND_HEIGHT});
		
  //Setup groups
  $.playground()
  .addGroup("inputbox", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
  .addGroup("popup", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
  .addGroup("blur", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
  .addGroup("overlay", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
  .addGroup("GFXG", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
  .addGroup("Cards", {width: PLAYGROUND_WIDTH, 
    height: PLAYGROUND_HEIGHT})
	
  //Setup UI
  //Add borders.
  $("#background").addSprite("BG", {animation: IM.GetMisc(BackI), width: BGSIZE.x, height: BGSIZE.y});
  
  $("#overlay").append("<div id='BorderTop'></div>");
  
  //Create a div for the Point UI.
  $("#overlay").append("<div id='PointHUD' style='text-align:center'></div>");
  
  //Create a div for the Time UI.
  $("#overlay").append("<div id='TimeHUD' style='text-align:center'></div>");
  
  //Create a div for the Level UI.
  $("#overlay").append("<div id='LevelHUD' style='text-align:center'></div>");
  
  current = $('#PointHUD');
  current.html("Points: "+Math.round(PointsV));
  
  //Add div for control buttons
  $("#overlay").append("<div id='PauseBut'></div>");
  $("#overlay").append("<div id='MuteMBut'></div>");
  $("#overlay").append("<div id='MuteSBut'></div>");

  
  //Add the control buttons to the UI
  myButton = document.createElement("input");
  myButton.type = "button";
  myButton.value = "Pause";
  myButton.id = "ButP";
  Current = $(myButton);
  myButton.onclick = PauseGame;
  placeHolder = document.getElementById("PauseBut");
  placeHolder.appendChild(myButton);
  
  
  myButton = document.createElement("input");
  myButton.type = "button";
  myButton.value = "Mute Music";
  myButton.id = "ButMM";
  Current = $(myButton);
  myButton.onclick = MuteMusic;
  placeHolder = document.getElementById("MuteMBut");
  placeHolder.appendChild(myButton);
  
  
  myButton = document.createElement("input");
  myButton.type = "button";
  myButton.value = "Mute Sound";
  myButton.id = "ButMS";
  Current = $(myButton);
  myButton.onclick = MuteSound;
  placeHolder = document.getElementById("MuteSBut");
  placeHolder.appendChild(myButton);
  
  
  //Create the first level.
  CreateLevel();
  
  Scores = new Array();
  Scores.sort(CustomSort);
  
  /**
   * Starts the game. Much of it is actually gamequery specific code.
   */
  function StartGame()
  {
    $.playground().startGame(function(){
      Then = new Date().getTime();
      GameStart = true;
      //no BG music if iPad
      if (ppDetect[0,0] != "iPad" || ppDetect[0,0] == "Macintosh" || ppDetect[0,0] == "iPhone" || pppDetect[0,0] == "Android")
        soundBG.play( createjs.Sound.INTERRUPT_NONE, 0, 0, 1)
            $("#welcomeScreen").remove();
        });
  }
  
    //THIS IS THE MAIN LOOP
    $("#playground").registerCallback(function()
  {
    //Calcualte how many miliseconds passed since last frame, to get smoother animations.
    Now = new Date().getTime();
    Delta = Now - Then;
    if (!ShowingMessage)
    {
      if (Ended == 2)
      {
        var Current = $("#HighscoreHUD");
        /**
		 * If we are showing the highscore, center the highscore on the screen each frame, in case the resolution changes.
         * Current.html(Line+"<hr style='color: #EAB344; background-color: #EAB344; height: 5px; border: 0;'><br><p id='"+HSLines+"' style='padding: 0 30px;'>Tryk Enter for at starte et nyt spil</p>");
         */
		Current.css({left: (PLAYGROUND_WIDTH - Current.width())/2, top:  (PLAYGROUND_HEIGHT - Current.height() - 60)/2});
      }
      else
      if (Ended == 1)
      {
		//TODO: DO IT USING KEYPRESSES HOPEFULLY
		if (pppDetect[0,0] == "Android")
		{
			Name = $("#inputBox").val();
		}
        /**
		 * If we are entering our name:
         * Generate a string based on the name varaible, which is changed in onkeypress
		 */
        var string = "Du har høj nok score til at komme på highscoren!<br>Skriv venligst dit navn:<br>"+Name+"<br>Tryk Enter for at fortsætte";


    
        var Current = $("#NameEnterHUD");
        //Apply the string to the div, and recenter it.
        Current.html(string);
        //TODO: Find a way to get the padding possibly.
        Current.css({left: (PLAYGROUND_WIDTH - Current.width()  - 60)/2, top:  (PLAYGROUND_HEIGHT - Current.height())/2});
        
        
        ForEachGFX(function()
        {
          //For each card, perform their step event.
          this.GFX.Despawn();
        });
      }
      else
      {
        //Basic Game Engine!!
        
        //Resize time hud, because the values change while playing.
        current = $("#TimeHUD");
        current.html("Time: "+Math.ceil(CurGameTime/1000));
        current.css({ left: Math.floor((ButSpace*2+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
        
        
        ForEachCard(function()
        {
          //For each card, perform their step event.
          this.Cards.Step();
        });
        
        ForEachGFX(function()
        {
          //For each GFX, perform their step event.
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
        
        //TODO: Remove
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
          
        //TODO: Remove
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
        
        //Count down the game time. but only once the game has started
        if(GameStart = true)
        {
          if (Turned < LM.NumberOfCards)
          CurGameTime= CurGameTime-Delta;
        }
        
        //If we have matched all the cards.
        if (Turned >= LM.NumberOfCards)
        {
          DoneTimer+=Delta;
          Done = true;
          
          //if Leveldiv does not exist, create it and show the next level we get to.
          if ($("#Leveldiv").length==0)
          {
            ForEachCard(function()
            {
              this.Cards.node.fadeOut();
            });
            
            $("#popup").append("<div id='Leveldiv''></div>");
            $("#Leveldiv").html("Level: "+(CurLevel+1));
          }
          Current = $("#Leveldiv");
          Current.css({left: PLAYGROUND_WIDTH/2-Current.width()/2-30, top: PLAYGROUND_HEIGHT/2-Current.height()/2-30});
          
          //If done, count the timer up to create a delay before next level.
          
          if (DoneTimer>1500)
          {
            //About 0.5 seconds before creating next level, fade it out.
            $("#Leveldiv").fadeOut();
          }
          if (DoneTimer>2000)
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
            $("#Leveldiv").remove();
            CreateLevel();
          }
        }  
      }
    }
    
    //Reset then, so that we can calculate delta-time next frame.
    Then = Now;
    
    //Counts the points up, The further away they are, the more they will count up.
    if (PointsV<Points)
    {
      PointsV+=((Points - PointsV)/300+0.33) * (Delta);
    
      //Make sure they don't count up too much.
      if (PointsV>Points) PointsV=Points;
      
      /**
	   * Creates a div to test text width.
       * This is a repition of the code at line: 815
       * It is only here because the game could theoretically count up points each frame, and this needs to be accounted for.
	   */
      $("#overlay").append("<div id='TextTestDiv' style='text-align:center; left: 0; top: 0;'></div>");
      Current = $("#TextTestDiv");
      Current.css("font-size", Math.floor(220* Math.min($('#PointHUD').width()/215, ScaleUI))+'%');
      Current.html("Points: "+Math.round(PointsV));
      var TextSize = Current.width();
      Current.remove();
      
      var TScale = Math.min($('#PointHUD').width()/215, ScaleUI);
      TScale*=Math.min($('#PointHUD').width()/(TextSize+10),1);
      
      current = $('#PointHUD');
      current.html("Points: "+Math.round(PointsV));
      current.css("font-size", Math.floor(220* TScale)+'%');
      current.css({ left: Math.floor((ButSpace*3+10)-Math.floor(current.width()/2)- ButSpace/2), top: 10});
      
      current = $("#TimeHUD");
      current.css("font-size", Math.floor(220* TScale)+'%');
      
      current = $("#LevelHUD");
      current.css("font-size", Math.floor(220* TScale)+'%');
    }
    
    EndedL=Ended;
  //Loop
    }, Math.min(0,REFRESH_RATE-Delta));
  
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
