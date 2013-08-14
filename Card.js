function Cards(node)
{
	this.WIDTH = 208;
	this.HEIGHT = 303;
	
	this.value = 0;
	
	this.FaceF;
	this.FaceB;
	
	this.DEBUG;
	
	this.visible=true;
	
	this.Flipped=false;
	
	this.node = $(node);
	
	this.Timer = 0;
	this.Hiding = 0;
	
	this.Create = function(Value, FaceF, FaceB, DEBUG)
	{
		//Create all cards
		this.value = Value;
		this.FaceB = FaceB;
		this.FaceF = FaceF;
		this.DEBUG = DEBUG;
	}

	this.Step = function()
	{
		//The step event for cards, probably won't be used.
		this.Timer+=1;
		if (this.Timer>30 && this.Hiding==1)
			this.TrueHide();
		else
		if (this.Timer>30 && this.Hiding==2)
		{
			node.w(0);
			node.h(0);
		}
			
	}

	this.ChangeFace = function(face)
	{
		//Changes the face.
		this.node.setAnimation(face, null);
	}

	this.Turn = function()
	{
		//Turns the Card around.
	}
	
	this.Clicked = function()
	{
		console.log(this.DEBUG);
		if (this.Flipped==false)
		{
			this.Flipped=true;
			this.ChangeFace(this.FaceF);
		}
		else
		{
			this.Flipped=false;
			this.ChangeFace(this.FaceB);
		}
	}
	
	this.Hide = function()
	{
	if (this.Hiding!=2)
		{	
			this.Timer = 0;
			this.Hiding = 1;
		}
	}
	
	this.TrueHide = function()
	{
		this.Hiding = 0;
		this.Flipped=false;
		this.ChangeFace(this.FaceB);
	}
	
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