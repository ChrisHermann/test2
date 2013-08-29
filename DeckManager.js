	function DeckManager()
{
	//This class will manage the deck
	//It will be used to set up the current levels and
	//Make it easier to manage which cards are
	//still available
	this.NOC = 0;
	this.NOBC = 0;
	
	
	this.CardPool = new Array();
	this.BonusCardPool = new Array();
	this.NextVal;
	this.LastB;
	
	//Sets hte class up properly.
	this.Create = function(CardPool, BonusCardPool)
	{
		this.CardPool = CardPool;
		this.BonusCardPool = BonusCardPool;
		
		this.NextVal=Math.floor(Math.random()*(CardPool.length + BonusCardPool.length));
	}
	
	//Gets the next card and removes it from the deck. 
	//Next val is determined beforehand so we can also peek at it without removing it from the deck.
	this.PushCard = function()
	{
		var val;
		//Calculates which of the pools the card is from, and assigns the result to val, which is then returned.
		if (this.NextVal>=this.CardPool.length)
		{
			val = this.BonusCardPool[this.NextVal - this.CardPool.length];
			this.LastB = true;
		
			//Then we need to remove the drawn card from the deck.
			
			this.BonusCardPool.splice(this.NextVal - this.CardPool.length,1);
		}
		else
		{
			val = this.CardPool[this.NextVal];
			this.LastB = false;
			
			
			//Then we need to remove the drawn card from the deck.
			
			this.CardPool.splice(this.NextVal,1);
		}
		
		
		//Determine the next card to be drawn.
		this.NextVal=Math.floor(Math.random()*(this.CardPool.length + this.BonusCardPool.length));
		
		return (val);
	}
	
	//Peeks at the next card, without removing it from the deck.
	this.PeekCard = function()
	{
		var val;
		if (NextVal>CardPool.length)
		{
			val = this.BonusCardPool[this.NextVal - this.CardPool.length];
		}
		else
		{
			val = this.CardPool[this.NextVal];
		}
	}
	
	//Returns the size of hte deck for this level.
	this.GetNumberOfCards = function()
	{
		return(CardPool.length + BonusCardPool.length);
	}
	
	//Returns wether the last card drawn was a bonus card or not.
	this.LastBonus = function()
	{
		return(this.LastB);
	}
	
	//Returns wether the next card to be drawn will be a bonus card or not.
	this.NextBonus = function()
	{
		if (NextVal>CardPool.length)
		{
			return (true);
		}
		else
		{
			return(false);
		}
	}
	
	//Returns a random bonus card, within the appropriate range.
	this.GetRandomBonus = function()
	{
		//return(POINTID);
		return(SWARTZID+Math.floor(Math.random()*BONUSES));
	}
}