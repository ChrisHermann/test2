function Cards(node)
{
	//The card class, and it's attributes.
	this.WIDTH = 208;
	this.HEIGHT = 303;
	
	this.value = 0;
	
	this.FaceF;
	this.FaceB;
	
	this.DEBUG;
	
	this.visible=true;
	
	this.Flipped=false;
	
	this.Turning=false;
	this.changed = false;
	
	this.node = $(node);
	
	this.factor = 1;
	this.Dir = 3.14/2;
	
	this.Timer = 0;
	this.Hiding = 0;
	
	this.Create = function(Value, FaceF, FaceB, DEBUG)
	{
		//Used to set up the necessary attributes of a card.
		this.value = Value;
		this.FaceB = FaceB;
		this.FaceF = FaceF;
		this.DEBUG = DEBUG;
	}

	this.Step = function()
	{
		//The step event for cards, this wil be performed each frame.
		//Timers, used to create a delay before hiding/unflipping a card.
		this.Timer+=1;
		if (this.Timer>30 && this.Hiding==1)
			this.TrueHide();
		else
		if (this.Timer>30 && this.Hiding==2)
		{
			node.w(0);
			node.h(0);
		}
		
		if(this.Turning == true)
		{
		
		var spriteDOMObject = this.node[0];
		this.Dir += 0.05;
		console.log(this.Dir);
		
		if(this.Dir>=3.14 && this.changed==false){
			this.changed=true;
			this.ChangeFace(this.FaceF);
		}
		if (this.changed==true)
		this.factor=-Math.sin(this.Dir);
		else
		this.factor=Math.sin(this.Dir);
		
		var options = $.extend(spriteDOMObject.gameQuery, {factorh: this.factor});
			
		if(spriteDOMObject != undefined){
			spriteDOMObject.gameQuery = options;
		}
		
		this.node.transform();
		
		if(this.Dir>=3.14*1.5){
			this.Turning = false;
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
		this.Hiding = 0;
		this.Flipped=false;
		this.ChangeFace(this.FaceB);
	}
	
	//Effectively deletes the card by making it invisible.
	//We possibly need to find a better way to do this.
	this.SetVisible = function(Visible)
	{
		if (Visible == false)
		{
			this.Hiding=2;
			this.Timer=0;
			this.visible=false;
		}
		else
		{
			node.w(WIDTH);
			node.h(HEIGHT);
			this.visible=true;
		}
	}
}