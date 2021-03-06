  /**
   * @file
   * This class will manage the deck
   * It will be used to set up the current levels and
   * Make it easier to manage which cards are
   * still available
  */
function LevelManager(node){
  this.NumberOfCards;
  this.NumberOfCardsBonus;
  this.Difficulty;
  this.Increment;
  
  this.BonusCardsBase;
  this.BonusCardsRandom;
  
  this.MaxCards;
  this.ActuallyMaxCards;
  
  /**
   * Sets up the object.
   * 
   * @param integer MaxCards
   *   Max cards are the maximum amount of cards used for pairing.
   * @param integer ActuallyMaxCards
   *   ActualMaxCards are the maximum amount of cards to be shown on the screen.
   */
  this.Create = function(MaxCards, ActuallyMaxCards){
    this.Difficulty = 0.15;
    this.Increment = 0.05;
    this.BonusCardsBase = 0.0;
    this.BonusCardsRandom = 0.2;
    
    this.MaxCards = MaxCards;
    this.ActuallyMaxCards = ActuallyMaxCards;
  }
  /**
   * Sets up the next level.
   */
  this.NextLevel = function(){
    //First increase difficulty, and cap it at 1 (100%)
    this.Difficulty += this.Increment;
    if (this.Difficulty>1) this.Difficulty=1;
    
    //Second calculate the amount of bonus cards, based on a base and small random attribute.
    var bonus = this.BonusCardsBase+Math.random()*this.BonusCardsRandom;
    
    //Now calculate how many normal cards we should use for this level, this is a raw number.
    this.NumberOfCards = Math.round(this.ActuallyMaxCards * this.Difficulty * (1 - bonus));
    
    //Now, make sure the number of normal cards are divideable by two.
    if (this.NumberOfCards/2 != Math.ceil(this.NumberOfCards/2)){
      
      /**
       * if not, then unless the amount of normal cards are equal to the total amount of cards
       * increase the number or normal cards by one, if it is equal, decrease it by one.
       */
      if (this.NumberOfCards!= Math.round(this.ActuallyMaxCards * this.Difficulty))
        this.NumberOfCards++;
      else
        this.NumberOfCards--;
    }
    
      
    //If the number of cards are below two, set them to two, because having less than two cards in a pairing game sucks.
    if (this.NumberOfCards < 2) this.NumberOfCards = 2;
    
    //Make sure it doesn't exceed the cards for this level.
    if (this.NumberOfCards > this.ActuallyMaxCards * this.Difficulty){
      if (Math.round(this.ActuallyMaxCards * this.Difficulty)/2 == Math.ceil(Math.round(this.ActuallyMaxCards * this.Difficulty)/2))
        this.NumberOfCards = (this.ActuallyMaxCards * this.Difficulty);
      else
        this.NumberOfCards = (this.ActuallyMaxCards * this.Difficulty) - 1;
    }
    
    //Make sure it doesn't exceed the maximum.
    if (this.NumberOfCards > this.MaxCards){
      if (this.MaxCards/2 == Math.ceil(this.MaxCards/2))
        this.NumberOfCards = this.MaxCards;
      else
        this.NumberOfCards = this.MaxCards-1;
    }
    
    //Now all cards that will not be used for normal cards, should be made into bonus cards.
    this.NumberOfCardsBonus =  Math.round(this.ActuallyMaxCards * this.Difficulty - this.NumberOfCards);
  }
  
}