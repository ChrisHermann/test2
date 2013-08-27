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
	
	//Sets up the object.
	this.Create = function(MaxCards, ActualyMaxCards)
	{
		//Max cards are the maximum amount of cards used for pairing.
		//ActualMaxCards are the maximum amount of cards to be shown on the screen.
		this.Difficulty = 0.6;
		this.Increment = 0.1;
		this.BonusCardsB = 0.0;
		this.BonusCardsR = 0.2;
		
		this.MaxCards = MaxCards;
		this.ActualyMaxCards = ActualyMaxCards;
	}
	//Sets up hte next level.
	this.NextLevel = function()
	{
		//First increase difficulty, and cap it at 1 (100%)
		this.Difficulty += this.Increment;
		if (this.Difficulty>1) this.Difficulty=1;
		
		//Second calculate the amount of bonus cards, based on a base and small random attribute.
		var bonus = this.BonusCardsB+Math.random()*this.BonusCardsR-Math.random()*this.BonusCardsR;
		
		//Now calculate how many normal cards we should use fir this level, this is a raw number.
		this.NumberOfCards = Math.round(this.MaxCards * this.Difficulty * (1 - bonus));
		
		//Now, make sure the number of normal cards are divideable by two.
		if (this.NumberOfCards/2 != Math.ceil(this.NumberOfCards/2))
		{
			//if not, then unless the amount of normal cards are equal to the total amount of cards
			//increase the number or normal cards by one, if it is equal, decrease it by one.
			if (this.NumberOfCards!= this.MaxCards)
				this.NumberOfCards++;
			else
				this.NumberOfCards--;
		}
		
		//If the number of cards are below two, set them to two, because having less than two cards in a pairing game sucks.
		if (this.NumberOfCards < 2) this.NumberOfCards = 2;
		
		//This code should not be needed!
		//It's a security code that should only kick in if the amount of bonus cards go negative.
		if (this.NumberOfCards > this.MaxCards)
		{
			if (this.MaxCards/2 == Math.ceil(this.MaxCards/2))
				this.NumberOfCards = this.MaxCards;
			else
				this.NumberOfCards = this.MaxCards-1;
		}
		
		//Now all cards that will not be used for normal cards, should be made into bonus cards.
		this.NumberOfCardsBonus =  Math.round(this.ActualyMaxCards * this.Difficulty - this.NumberOfCards);
	}
	
}