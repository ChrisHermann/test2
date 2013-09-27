/**
 * @file
 * The Card Class
 */
function Cards(node, image, sizeX, sizeY)
{
  //These attributes may be obsolete atm.
  this.WIDTH = sizeX;
  this.HEIGHT = sizeY;
  this.Size = 208;
  
  this.value = 0;
  
  this.FaceFront;
  this.FaceBack;
  this.FaceSchwartz;
  
  this.Schwartzed = false;
  this.SchwartzedTimer = 0;
  
  this.Bonus;
  
  this.visible=true;
  
  this.Flipped=false;
  this.FlippedVisual=false;
  
  this.Turning=false;
  this.changed = false;
  
  this.node = $(node);
  this.image = $(image);
  
  this.factor = 1;
  this.scale  = 1;
  this.InternalWidth;
  this.InternalHeight;
  this.Direction = 3.14/2;
  
  //Seconds times 1000
  this.TurnSteps = 0.7*1000;
  
  this.Timer = 0;
  
  this.Hiding = 0;
  
  /**
   * Changes the face of the card.
   * The face needs to be preloaded.
   * 
   * @param string face
   *   the path to the image
   */
  this.ChangeFace = function(face)
  {
    this.image.attr('src',face);
    //Hackish method.
    
    this.image.load(function(){
      $(this.parentNode).width(this.parentNode.Cards.WIDTH);
      $(this.parentNode).height(this.parentNode.Cards.HEIGHT);
    });
  }
  
  /**
  * Used to set up the necessary attributes of a card.
  * 
  * @param integer Value
  *   Value is the value of the card.
  * @param string FaceF
  *   FaceF is the image for the front-side of the card.
  * @param string FaceS
  *   FaceS is the image that is used for the swartz bonus card.
  * @param string FaceB
  *   FaceB is the image that will make up the back-side of the card.
  * @param bool Bonus
  *   Bonus is if the card is a bonus card or not.
  * @param integer scale
  *   Scale is the overall scale of the card. All other scalings will take base in this one.
  *   This should mainly be changed for resizing, if not, it should be left unchanged.
  */
  this.Create = function(Value, FaceFront, FaceSchwartz, FaceBack, Bonus, scale)
  {
    //Set base values.
    this.value = Value;
    this.FaceBack = FaceBack;
    this.FaceFront = FaceFront;
    this.FaceSchwartz = FaceSchwartz;
    this.scale = scale;
    this.Bonus = Bonus;
    
    this.InternalWidth = this.Size/this.node.width();
    this.InternalHeight = this.Size/this.node.height();
    
    this.image.width(this.WIDTH);
    this.image.height(this.HEIGHT);
    this.node.width(this.WIDTH);
    this.node.height(this.HEIGHT);
  }
  /**
   * Executes the effects of the bonus cards
   */
  this.RunBonus = function()
  {
    //Runs the bonus effect of the card (If there is one).
    if (this.value == SCHWARTZID)
    {
      /**
       * Schwartz card, goes to every card and sets the variable swarzted to true, telling them to reveal the
       * Schwarts face. If they are already flipped, change their face to swartzs immediately.
       */
      ForEachCard(function()
      {
        this.Cards.Schwartzed = true;
        //Set an internal timer to 5 seconds, so that the card will return to normal after that time.
        this.Cards.SchwartzedTimer = 5*1000;
        
        //Change the face of hte card if it is flipped.
        if (this.Cards.Flipped==true && this.Cards.changed==true)
          this.Cards.ChangeFace(this.Cards.FaceSchwartz);
      });
    
      //Fate out the original bonus card (The bonus has been activated now.
      node.fadeOut();
      this.visible=false;
    }
    if (this.value == POINTID)
    {
      /**
	   * Simple add 500 points to the players score.
       * Create the GFX for the points!
       * The points won't be awarded until het GFX is actually gone.
       */
      $("#GFXG").append("<div id='GFX_"+GFXCount+"' style='position: absolute'></div>");
      $("#GFX_"+GFXCount).append("<img id='IGFX_"+GFXCount+"' draggable='false' class='image'/>");
      
      //Set up the parameters used
      var Current = $("#GFX_"+GFXCount)[0];
        
      Current.GFX = new GFX($("#GFX_"+GFXCount), $("#IGFX_"+GFXCount));
      
      
      //Run a function once the image is done loading.
      $("#IGFX_"+GFXCount).load(function()
      {
        this.parentNode.GFX.SetSize($(this).width(), $(this).height());
      });
      $("#IGFX_"+GFXCount).attr('src',ImageManagerObject.GetMisc(POINTS1));
      
      //Create the GFX with the appropriate parameters
      Current.GFX.Create(1, 1, 1, 1, {x: this.node.position().left+this.node.width()/2, y: this.node.position().top}, {x: this.node.position().left+this.node.width()/2, y: this.node.position().top-50}, 1);
        
      //When it despawns call this function.
      Current.GFX.EndCall(function()
      {
        //The reason to create two effects after each other is to make a fancier animation.
        $("#GFXG").append("<div id='GFX_"+GFXCount+"' style='position: absolute'></div>");
        $("#GFX_"+GFXCount).append("<img id='IGFX_"+GFXCount+"' draggable='false' class='image'/>");
        
        //The next code does the same as the code above.
        var Current = $("#GFX_"+GFXCount)[0];
        
        Current.GFX = new GFX($("#GFX_"+GFXCount), $("#IGFX_"+GFXCount));
        
        $("#IGFX_"+GFXCount).load(function()
        {
          this.parentNode.GFX.SetSize($(this).width(), $(this).height());
        });
        $("#IGFX_"+GFXCount).attr('src',ImageManagerObject.GetMisc(POINTS1));
        var DIV = $("#PointHUD");
        
        //Limit it to 70, to make sure it will never overlap the "score:" caption
        Current.GFX.Create(1, 1, 1, 1, this.StartPosition, {x: Math.max( 70,DIV.offset().left + DIV.width() - this.node.width()), y: DIV.offset().top}, 1);
        
        //When this GFX despawns award the 500 points.
        Current.GFX.EndCall(function()
        {
          Points+=500;
        });
        
        GFXCount++;
      });
      
      GFXCount++;
      
      node.fadeOut();
      this.visible=false;
    }
    if (this.value == PAIRID)
    {
      /**
	   * This card will find a pair for you. If you already have a card flipped, it will find the matching card and
       * Flip that one, if not, it will set autocomplete to true, telling the main class that the next time a card
       * Is turned, it should find a pair for that card.
	   */
      if (Turned > 0)
      {
        var Card;
        ForEachCard(function()
        {
          if (this.Cards.Flipped==true && this.Cards.Bonus==false && this.Cards.visible == true)
          {
            Card = this.Cards;
            
          }
        });
        
        this.visible=false;
        var Someflip=false;
        
        ForEachCard(function()
        {
          if (this.Cards.Flipped==false && Someflip==false && this.Cards.value == Card.value && this.Cards.visible == true)
          {
            this.Cards.node.mousedown();
            Someflip = true;
          }
        });
        
      }
      else
        Autocomplete = true;
      
      
      node.fadeOut();
      this.visible=false;
    }
    if (this.value == CONFUSEID)
    {
      /**
	   * Search through eligible cards. Cannot chose cards of hte same type.
       * This code will actually run twice, the first time is when the card is first flipped
       * it will then be told to flip back. The second time is when the card flips back, it will then
       * be told to execute the actual effect.
	   */
      if (this.FlippedVisual)
      {
        this.Turn();
        this.Flipped=false;
      }
      else
      {
        var PotentialCards = new Array();
        var n = 0;
        
        ForEachCard(function()
        {
          //Search through eligible cards. Cannot chose cards of the same type.
          if (this.Cards.visible == true && this.Cards.value != CONFUSEID && this.Cards.Flipped==false)
          {
            PotentialCards[n] = this.Cards;
            n++;
          }
        });
        
        
        //Here it exchanges the necessary variables to make the cards actually change place.
        var val = Math.floor(Math.random()*(PotentialCards.length));
        
        
        var Container =  this.value;
        this.value = PotentialCards[val].value;
        PotentialCards[val].value = Container;
        
        
        this.Bonus = PotentialCards[val].Bonus;
        PotentialCards[val].Bonus = true;
        
        
        var Container =  this.FaceFront;
        this.FaceFront = PotentialCards[val].FaceFront;
        PotentialCards[val].FaceFront = Container;
      }
    }
  }
  
  /**
   * All of this is run every frame
   */
  this.Step = function()
  {
    this.SchwartzedTimer-=Delta;
    if (this.SchwartzedTimer<=0 && this.Schwartzed)
    {
      this.ResetBonus();
    }
    if (this.visible == true)
    {
      /**
	   * The step event for cards, this will be performed each frame.
       * Timers, used to create a delay before hiding/unflipping a card.
       */
	  if (this.Timer>this.TurnSteps && this.Hiding==1)
        this.TrueHide();
      else
      if (this.Timer>this.TurnSteps && this.Hiding==2)
      {
        node.fadeOut();
        this.visible=false;
      }
      
      /**
	   * This code is run while the card is tuning, essentially it is the code that visually tuns it
       * Since JS uses radians for sinus, we use pi, we just use 3.14, rather than Math.PI, for performance increase.
       */
	  if(this.Turning == true)
      {
        //This adds to the direction of the card, based on the time that passed by.
        this.Direction += 3.14*(Delta/this.TurnSteps);
        
          //This code fires if it's over halfway, and changes the face of the card at that point.
          if(this.Direction>=3.14 && this.changed==false){
            this.changed=true;
            if(this.FlippedVisual==false)
            {
              if (this.Schwartzed && this.Bonus==false)
                this.ChangeFace(this.FaceSchwartz);
              else
                this.ChangeFace(this.FaceFront);
            }
            else
            this.ChangeFace(this.FaceBack);
          }
          /**
		   * //this calculates the factor of the card, based on direction and sin. If the face has changed though
           * //and it needs to be flipped back, we "reverse" the calculation, to avoid pictuers being drawn in
           * //reverse.
		   */
          if (this.changed==true)
            this.factor=-Math.sin(this.Direction);
          else
            this.factor=Math.sin(this.Direction);
          
          //This applies to factor to the width of the gamequery sprite.
          var spriteDOMObject = this.node[0];
          
          var options = $.extend(spriteDOMObject.gameQuery, {factorh:this.InternalWidth * this.factor * this.scale + Math.sin((this.Direction-3.14/2)) * 0.1 * this.scale, factorv: this.InternalHeight * this.scale  + Math.sin((this.Direction-3.14/2)) * 0.1 * this.scale});
            
          if(spriteDOMObject != undefined){
            spriteDOMObject.gameQuery = options;
        }
        
        //This updates the applied changes visually.
          this.image.width(this.WIDTH * this.factor * this.scale + Math.sin(this.Direction-3.14/2) * 0.1 * this.scale);
          this.image.height(this.HEIGHT * this.scale  + Math.sin(this.Direction-3.14/2) * 0.1 * this.scale);
          
        
        //This code runs when the card is done turning.
        if(this.Direction>=3.14*1.5){
          //Reset the factor.
          this.factor=1;
          
          //This applies to factor to the width of the gamequery sprite.
          /*var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.InternalWidth * this.factor * this.scale, factorv: this.InternalHeight * this.scale});
            
          if(spriteDOMObject != undefined){
            spriteDOMObject.gameQuery = options;
          }
          
          //This updates the applied changes visually.
          this.node.transform();*/
          
          this.image.width(this.WIDTH * this.factor * this.scale);
          this.image.height(this.HEIGHT * this.scale);
          
          
          
          //Resets all the variables, and sets VFlipped, which keeps track of what state the card is visually in.
          this.Turning = false;
          this.Direction=3.14/2;
          if (this.FlippedVisual==true) this.FlippedVisual=false; else this.FlippedVisual=true;
          if (this.Bonus==true)
            this.RunBonus();
        }
      
      }

      //Updates the internal timer.
      this.Timer+=Delta;
    }
  }

  /**
   * Turns the Card around.
   */
  this.Turn = function()
  {
    this.Turning = true;
    this.changed = false;
    
    if(AppleDetect[0,0] != "iPad" ||  AppleDetect[0,0] == "Macintosh" || AppleDetect[0,0] == "iPhone" || AndroidDetect[0,0] == "Android")
    FlipCardSound.play();
  }
  
  /**
   * This will be run whenever the card is clicked.
   */
  this.Clicked = function()
  {
    if (this.Flipped==false)
    {
      this.Flipped=true;
      this.Turn();
    }
    else
    {
      this.Flipped=false;
    }
  }
  
  /**
   * Used to make the card unflip (Hide is not a very good name for the function :( ).
   */
  this.Hide = function()
  {
    if (this.Hiding!=2)
    {  
      this.Timer = 0;
      this.Hiding = 1;
    }
  }
  
  /**
   * Used to make the card instantly hide rather than with a delay.
   */
  this.TrueHide = function()
  {
    this.Hiding = 0;
    this.Flipped=false;
    this.Turn();
  }
  
  /**
   * Effectively deletes the card by making it invisible.
   * 
   * @param bool Visible
   *   True if the card should be visible, false if it should be "deleted"
   */
  this.SetVisible = function(Visible)
  {
    if (Visible == false)
    {
      this.Hiding=2;
      this.Timer=0;
    }
    else
    {
      node.w(WIDTH);
      node.h(HEIGHT);
      this.visible=true;
    }
  }
  /**
   * Makes the card not swartzed any longer. It will again show it's true face.
   */
  this.ResetBonus = function()
  {
    this.Schwartzed = false;
    if (this.Flipped==true && this.changed==true)
    this.ChangeFace(this.FaceFront);
  }
  
  /**
   * Updates the card visually, and applies whatever options you want to it.
   * 
   * @param object options
   *   updates the current options, look at gameQuery for more detail.
   */
  this.Update = function(options)
  {
    //Again, ugly code, this is how gamequery does it though.
    var spriteDOMObject = this.node[0];
        
    var options_final = $.extend(spriteDOMObject.gameQuery, {factorh: this.InternalWidth * this.factor * this.scale + Math.sin((this.Direction-3.14/2)) * 0.1 * this.scale, factorv: this.InternalHeight * this.scale  + Math.sin((this.Direction-3.14/2)) * 0.1 * this.scale});
    options_final = $.extend(spriteDOMObject.gameQuery, options);
    
    
    if(spriteDOMObject != undefined){
      spriteDOMObject.gameQuery = options_final;
      }
      
    this.node.transform();
  }
}