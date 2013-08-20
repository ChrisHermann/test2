function Cards(node)
{
	//The card class, and it's attributes.
	this.WIDTH = 208;
	this.HEIGHT = 303;
	
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
	this.Dir = 3.14/2;
	
	this.TurnSteps = 30;
	
	this.Timer = 0;
	this.Hiding = 0;
	
	this.Create = function(Value, FaceF, FaceS, FaceB, Bonus, scale)
	{
		//Used to set up the necessary attributes of a card.
		this.value = Value;
		this.FaceB = FaceB;
		this.FaceF = FaceF;
		this.FaceS = FaceS;
		this.scale = scale;
		this.Bonus = Bonus;
		
		
		var spriteDOMObject = this.node[0];
				
		var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.scale, factorv: (208/303) * this.scale});
			
		if(spriteDOMObject != undefined){
			spriteDOMObject.gameQuery = options;
			}
			
		this.node.transform();
	}
	
	
	this.RunBonus = function()
	{
		if (this.value == 3)
		{
			$(".Cards").each(function()
			{
				this.Cards.Swartzed = true;
				
				if (this.Cards.Flipped==true && this.Cards.changed==true)
					this.Cards.ChangeFace(this.Cards.FaceS);
			});
		
			node.fadeOut();
			this.visible=false;
		}
	}
	

	this.Step = function()
	{
		if (this.visible == true)
		{
			//The step event for cards, this will be performed each frame.
			//Timers, used to create a delay before hiding/unflipping a card.
			this.Timer+=1;
			if (this.Timer>this.TurnSteps && this.Hiding==1)
				this.TrueHide();
			else
			if (this.Timer>this.TurnSteps && this.Hiding==2)
			{
				this.ResetBonus();
				node.fadeOut();
				this.visible=false;
			}
			
			
			
			if(this.Turning == true)
			{
			
				var spriteDOMObject = this.node[0];
				this.Dir += 3.14/this.TurnSteps;
				
				if(this.Dir>=3.14 && this.changed==false){
					this.changed=true;
					if(this.FlippedV==false)
					{
						if (this.Swartzed)
							this.ChangeFace(this.FaceS);
						else
							this.ChangeFace(this.FaceF);
					}
					else
					this.ChangeFace(this.FaceB);
				}
				if (this.changed==true)
				this.factor=-Math.sin(this.Dir);
				else
				this.factor=Math.sin(this.Dir);
				
				var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.factor * this.scale + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale, factorv: (208/303) * this.scale  + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale});
					
				if(spriteDOMObject != undefined){
					spriteDOMObject.gameQuery = options;
			}
			
			this.node.transform();
			
			if(this.Dir>=3.14*1.5){
				if (this.Bonus==true)
					this.RunBonus();
				this.Turning = false;
				this.Dir=3.14/2;
				if (this.FlippedV==true) this.FlippedV=false; else this.FlippedV=true;
			}
			
			}		
		}
	}

	this.ChangeFace = function(face)
	{
		//Changes the face of the card.
		this.node.setAnimation(face, null);
	}

	this.Turn = function()
	{
		//Turns the Card around.
		this.Turning = true;
		this.changed = false;
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
	//We possibly need to find a better way to do this.
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
	
	this.ResetBonus = function()
	{
		$(".Cards").each(function()
		{
			this.Cards.Swartzed = false;
		});
	}
	
	this.Update = function( options2)
	{
		var spriteDOMObject = this.node[0];
				
		var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.factor * this.scale + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale, factorv: (208/303) * this.scale  + Math.sin((this.Dir-3.14/2)) * 0.1 * this.scale});
		options = $.extend(spriteDOMObject.gameQuery, options2);
		
		
		if(spriteDOMObject != undefined){
			spriteDOMObject.gameQuery = options;
			}
			
		this.node.transform();
	}
}