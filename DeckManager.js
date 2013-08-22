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
	
	
	this.Create = function(CardPool, BonusCardPool, NumberOfCards, NumberOfBonusCards)
	{
		this.CardPool = CardPool;
		this.BonusCardPool = BonusCardPool;
		
		this.NextVal=Math.floor(Math.random()*(CardPool.length + BonusCardPool.length));
	}
	
	this.PushCard = function()
	{
		var val;
		if (this.NextVal>=this.CardPool.length)
		{
			val = this.BonusCardPool[this.NextVal - this.CardPool.length];
			this.LastB = true;
			
			var l =  this.BonusCardPool.length;
		
			//Then we need to remove the drawn card from the deck.
			for (var ii = 0; ii < l; ++ii)
			{
				if (ii==l - 1)
				{
					//Splice the last card to avoid dupes and to decrease the array length/RAM usage.
					this.BonusCardPool.splice(l - 1,1);
				}
				else
				if (ii>=this.NextVal - this.CardPool.length)
				{
					//Move all cards that are above the drawn card to one lesser index.
					this.BonusCardPool[ii] = this.BonusCardPool[ii + 1];
				}
			}
		}
		else
		{
			val = this.CardPool[this.NextVal];
			this.LastB = false;
			
			
		
			var l =  this.CardPool.length;
			//Then we need to remove the drawn card from the deck.
			for (var ii = 0; ii < l; ++ii)
			{
				if (ii==l - 1)
				{
					//Splice the last card to avoid dupes and to decrease the array length/RAM usage.
					this.CardPool.splice(l - 1,1);
				}
				else
				if (ii>=this.NextVal)
				{
					//Move all cards that are above the drawn card to one lesser index.
					this.CardPool[ii] = this.CardPool[ii + 1];
				}
			}
		}
		
		
			
		this.NextVal=Math.floor(Math.random()*(this.CardPool.length + this.BonusCardPool.length));
		
		
		return (val);
	}
	
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
	
	this.GetNumberOfCards = function()
	{
		return(CardPool.length + BonusCardPool.length);
	}
	
	this.LastBonus = function()
	{
		return(this.LastB);
	}
	
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
}