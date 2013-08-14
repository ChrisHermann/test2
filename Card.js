Cards = new function(Size)
{
	this.WIDTH;
	this.HEIGHT;

	this.IMAGES[];
	this.UNDRAWN[];
	this.BACKIMAGE;
	
	this.pool = new Array();
	for (var i = 0; i < Size; ++i)
		this.pool.push({ value:0 });
}

Cards.prototype.Create = function()
{
	//Create all cards
}

Cards.prototype.CreateOne = function()
{
	//Create one card
}

Cards.prototype.Step = function()
{
	//The step event for cards, probably won't be used.
}

Cards.prototype.Draw = function()
{
	//Draws the card.
}

Cards.prototype.Turn = function()
{
	//Turns the Card around.
}