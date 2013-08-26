function LevelManager(node)
{
	//This class will manage the deck
	//It will be used to set up the current levels and
	//Make it easier to manage which cards are
	//still available
	
	this.NumberOfCards;
	this.NumberOfCardsBonus;
	this.Difficulty;
	this.Increment;
	
	this.BonusCardsB;
	this.BonusCardsR;
	
	this.MaxCards;
	this.ActualyMaxCards;
	
	this.Create = function(MaxCards, ActualyMaxCards)
	{
		this.Difficulty = 0.4;
		this.Increment = 0.1;
		this.BonusCardsB = 0.0;
		this.BonusCardsR = 0.2;
		
		this.MaxCards = MaxCards;
		this.ActualyMaxCards = ActualyMaxCards;
	}
	
	this.Step = function()
	{
		
	}
	
	this.NextLevel = function()
	{
		this.Difficulty += this.Increment;
		if (this.Difficulty>1) this.Difficulty=1;
		
		var bonus = this.BonusCardsB+Math.random()*this.BonusCardsR-Math.random()*this.BonusCardsR;
		
		this.NumberOfCards = Math.round(this.MaxCards * this.Difficulty * (1 - bonus));
		
		if (this.NumberOfCards/2 != Math.ceil(this.NumberOfCards/2))
		{
			if (this.NumberOfCards!= this.MaxCards)
				this.NumberOfCards++;
			else
				this.NumberOfCards--;
		}
		
		if (this.NumberOfCards < 2) this.NumberOfCards = 2;
		
		//This code should not be needed!
		if (this.NumberOfCards > this.MaxCards)
		{
			if (this.MaxCards/2 == Math.ceil(this.MaxCards/2))
				this.NumberOfCards = this.MaxCards;
			else
				this.NumberOfCards = this.MaxCards-1;
		}
		
		this.NumberOfCardsBonus =  Math.round(this.ActualyMaxCards * this.Difficulty - this.NumberOfCards);
	}
	
}