function Cards(node)
{
	this.WIDTH = 208;
	this.HEIGHT = 303;
	
	this.node = $(node);
	
	this.Create = function()
	{
		//Create all cards
	}

	this.CreateOne = function()
	{
		//Create one card
	}

	this.Step = function()
	{
		//The step event for cards, probably won't be used.
		this.node.x(10,true);
	}

	this.Draw = function()
	{
		//Draws the card.
	}

	this.Turn = function()
	{
		//Turns the Card around.
	}
}