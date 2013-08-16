function DeckManager()
{
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
}