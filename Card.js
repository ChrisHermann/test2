function Cards(node)
{
	//The card class, and it's attributes.
	//These attributes may be obsolete atm.
	this.WIDTH = 208;
	this.HEIGHT = 303; 
	this.Size = 208;
	
	this.value = 0;
	
	this.FaceF;
	this.FaceB;
	this.FaceS;
	
	this.Swartzed = false;
	
	this.Bonus;
	
	this.visible=true;
	
	this.Flipped=false;
	this.FlippedV=false;
	
	this.Turning=false;
	this.changed = false;
	
	this.node = $(node);
	
	this.factor = 1;
	this.scale  = 1;
	this.internalw;
	this.internalh ;
	this.Dir = 3.14/2;
	
	//Seconds times 1000
	this.TurnSteps = 0.7*1000;
	
	//this.TempDelta = 30;
	
	this.Timer = 0;
	
	this.Hiding = 0;
	
	this.ChangeFace = function(face)
	{
		//Changes the face of the card.
		//The face needs to be preloaded.
		this.node.setAnimation(face, null);
	}
	
	
	this.Create = function(Value, FaceF, FaceS, FaceB, Bonus, scale)
	{
		//Used to set up the necessary attributes of a card.
		//Value is the value of the card.
		//FaceF is the image for the front-side of the card.
		//FaceS is the image that is used for
		//FaceB is the image that will make up the back-side of the card.
		//Bonus is if the card is a bonus card or not.
		//Scale is the overall scale of the card. All other scalings will take base in this one.
		//This should mainly be changed for resizing, if not, it should be left unchanged.
		this.value = Value;
		this.FaceB = FaceB;
		this.FaceF = FaceF;
		this.FaceS = FaceS;
		this.scale = scale;
		this.Bonus = Bonus;
		
		
		this.internalw = this.Size/this.node.w();
		this.internalh = this.Size/this.node.h();
		//Applies the correct scale to the card. The code seems messy, but that's how game engine does it.
		var spriteDOMObject = this.node[0];
				
		var options = $.extend(spriteDOMObject.gameQuery, {factorh:this.internalw * this.scale, factorv: this.internalh * this.scale});
			
		if(spriteDOMObject != undefined){
			spriteDOMObject.gameQuery = options;
			}
			
		this.node.transform();
	}
	
	this.RunBonus = function()
	{
		//Runs the bonus effect of the card (If there is one).
		if (this.value == SWARTZID)
		{
			//Swartz card, goes to every card and sets the variable swarzted to true, telling them to reveal the
			//Swarts face. If they are already flipped, change their face to swartzs immediately.
			ForEachCard(function()
			{
				this.Cards.Swartzed = true;
				
				if (this.Cards.Flipped==true && this.Cards.changed==true)
					this.Cards.ChangeFace(this.Cards.FaceS);
			});
		
			node.fadeOut();
			this.visible=false;
		}
		if (this.value == POINTID)
		{
			//Simple add 500 points to the players score.
			//Points+=500;
			
			//Create the GFX for the points!
			
			$("#GFXG").addSprite("GFX_"+GFXCount, {animation: IM.GetMisc(POINTS1), width: 35, height: 21, posx: 0 , posy: 0 });
			
			var Current = $("#GFX_"+GFXCount)[0];
			
			Current.GFX = new GFX($("#GFX_"+GFXCount));
			Current.GFX.Create(1, 1, 1, 1, {x: this.node.x()+this.node.w()/2, y: this.node.y()}, {x: this.node.x()+this.node.w()/2, y: this.node.y()-50}, 1);
			
			
			Current.GFX.EndCall(function() {
			
				$("#GFXG").addSprite("GFX_"+GFXCount, {animation: IM.GetMisc(POINTS1), width: 35, height: 21, posx: 0 , posy: 0 });
				
				var Current = $("#GFX_"+GFXCount)[0];
				
				Current.GFX = new GFX($("#GFX_"+GFXCount));
				var DIV = $("#PointHUD");
				
				//Limit it to 70, to make sure it will never overlap the "score:" caption
				Current.GFX.Create(1, 1, 1, 1, this.StartPosition, {x: Math.max( 70,DIV.offset().left + DIV.width() - this.node.width()), y: DIV.offset().top}, 1);
				
				
				Current.GFX.EndCall(function() {
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
			//This card will find a pair for you. If you already have a card flipped, it will find the matching card and
			//Flip that one, if not, it will set autocomplete to true, telling the main class that the next time a card
			//Is turned, it should find a pair for that card.
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
			//Search through eligible cards. Cannot chose cards of hte same type.
			//This code will actually run twice, the first time is when the card is first flipped
			//it will then be told to flip back. The second time is when the card flips back, it will then
			//be told to execute the actual effect.
			if (this.FlippedV)
			{
				this.Turn();
				this.Flipped=false;
			}
			else
			{
				var PCards = new Array();
				var n = 0;
				
				ForEachCard(function()
				{
					//Search through eligible cards. Cannot chose cards of the same type.
					if (this.Cards.visible == true && this.Cards.value != CONFUSEID && this.Cards.Flipped==false)
					{
						PCards[n] = this.Cards;
						n++;
					}
				});
				
				
				//Here it exchanges the necessary variables to make the cards actually change place.
				var val = Math.floor(Math.random()*(PCards.length));
				
				
				var Container =  this.value;
				this.value = PCards[val].value;
				PCards[val].value = Container;
				
				
				this.Bonus = PCards[val].Bonus;
				PCards[val].Bonus = true;
				
				
				var Container =  this.FaceF;
				this.FaceF = PCards[val].FaceF;
				PCards[val].FaceF = Container;
			}
		}
	}
	
	this.Step = function()
	{
		if (this.visible == true)
		{
			//The step event for cards, this will be performed each frame.
			//Timers, used to create a delay before hiding/unflipping a card.
			if (this.Timer>this.TurnSteps && this.Hiding==1)
				this.TrueHide();
			else
			if (this.Timer>this.TurnSteps && this.Hiding==2)
			{
				this.ResetBonus();
				node.fadeOut();
				this.visible=false;
			}
			
			//This code is run while the card is tuning, essentially it is the code that visually tuns it
			//Since JS uses radians for sinus, we use pi, we just use 3.14, rather than Math.PI, for performance increase.
			if(this.Turning == true)
			{
				//This adds to the direction of the card, based on the time that passed by.
				this.Dir += 3.14*(Delta/this.TurnSteps);
				
					//This code fires if it's over halfway, and changes the face of the card at that point.
					if(this.Dir>=3.14 && this.changed==false){
						this.changed=true;
						if(this.FlippedV==false)
						{
							if (this.Swartzed && this.Bonus==false)
								this.ChangeFace(this.FaceS);
							else
								this.ChangeFace(this.FaceF);
						}
						else
						this.ChangeFace(this.FaceB);
					}
					//this calculates the factor of the card, based on direction and sin. If the face has changed though
					//and it needs to be flipped back, we "reverse" the calculation, to avoid pictuers being drawn in
					//reverse.
					if (this.changed==true)
						this.factor=-Math.sin(this.Dir);
					else
						this.factor=Math.sin(this.Dir);
					
					//This applies to factor to the width of the gamequery sprite.
					var spriteDOMObject = this.node[0];
					
					var options = $.extend(spriteDOMObject.gameQuery, {factorh:this.internalw * this.factor * this.scale + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale, factorv: this.internalh * this.scale  + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale});
						
					if(spriteDOMObject != undefined){
						spriteDOMObject.gameQuery = options;
				}
				
				//This updates the applied changes visually.
				this.node.transform();
				
				//This code runs when the card is done turning.
				if(this.Dir>=3.14*1.5){
					//Reset the factor.
					this.factor=1;
					
					//This applies to factor to the width of the gamequery sprite.
					var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.internalw * this.factor * this.scale, factorv: this.internalh * this.scale});
						
					if(spriteDOMObject != undefined){
						spriteDOMObject.gameQuery = options;
					}
					
					//This updates the applied changes visually.
					this.node.transform();
					
					
					
					//Resets all the variables, and sets VFlipped, which keeps track of what state the card is visually in.
					this.Turning = false;
					this.Dir=3.14/2;
					if (this.FlippedV==true) this.FlippedV=false; else this.FlippedV=true;
					if (this.Bonus==true)
						this.RunBonus();
				}
			
			}

			//Updates the internal timer.
			this.Timer+=Delta;
		}
	}

	this.Turn = function()
	{
		//Turns the Card around.
		this.Turning = true;
		this.changed = false;
		//createjs.Sound.play("sound");
		soundFlipCard.play();
	}
	
	this.Clicked = function()
	{
		//This will be run whenever the card is clicked.
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
	
	this.Hide = function()
	{
		//Used to make the card unflip (Hide is not a very good name for the function :( ).
		if (this.Hiding!=2)
		{	
			this.Timer = 0;
			this.Hiding = 1;
		}
	}
	
	//Used to make the card instantly hide rather than with a delay.
	this.TrueHide = function()
	{
		this.ResetBonus();
		this.Hiding = 0;
		this.Flipped=false;
		this.Turn();
	}
	
	//Effectively deletes the card by making it invisible.
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
	//Makes the card not swartzed any longer. It will again show it's true face.
	this.ResetBonus = function()
	{
		
		ForEachCard(function()
		{
			this.Cards.Swartzed = false;
		});
	}
	
	//Updates the card visually, and applies whatever options you want to it.
	this.Update = function(options2)
	{
		//Again, ugly code, this is how gamequery does it though.
		var spriteDOMObject = this.node[0];
				
		var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.internalw * this.factor * this.scale + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale, factorv: this.internalh * this.scale  + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale});
		options = $.extend(spriteDOMObject.gameQuery, options2);
		
		
		if(spriteDOMObject != undefined){
			spriteDOMObject.gameQuery = options;
			}
			
		this.node.transform();
	}
}