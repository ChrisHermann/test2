/**
 * @file
 * This class will manage the deck
 * It will be used to set up the current levels and
 * Make it easier to manage which cards are
 * still available
 */
function DeckManager(){
  this.NumberOfCards = 0;
  this.NumberOfBonusCards = 0;
  
  
  this.CardPool = new Array();
  this.BonusCardPool = new Array();
  this.NextVal;
  this.LastBonusBool;
  
  /**
   * Sets the class up properly.
   * @param array CardPool
   *   It's an array of cards used for the level
   * @param array BonusCardPool
   *   It's an array of bonuscards used for the level
   */
  this.Create = function(CardPool, BonusCardPool){
    this.CardPool = CardPool;
    this.BonusCardPool = BonusCardPool;
    
    this.NextVal=Math.floor(Math.random()*(CardPool.length + BonusCardPool.length));
  }
  
  /**
   * Gets the next card and removes it from the deck. 
   * NextVal is determined beforehand so we can also peek at it without removing it from the deck.
   * @return integer
   *   Returns the ID of hte next card in the stack.
   */
  this.PushCard = function(){
    var PushValue;
    //Calculates which of the pools the card is from, and assigns the result to PushValue, which is then returned.
    if (this.NextVal>=this.CardPool.length){
      PushValue = this.BonusCardPool[this.NextVal - this.CardPool.length];
      this.LastBonusBool = true;
    
      //Then we need to remove the drawn card from the deck.
		this.BonusCardPool.splice(this.NextVal - this.CardPool.length,1);
    }
    else{
      PushValue = this.CardPool[this.NextVal];
      this.LastBonusBool = false;
      
      //Then we need to remove the drawn card from the deck.
      this.CardPool.splice(this.NextVal,1);
    }
    
    //Determine the next card to be drawn.
    this.NextVal=Math.floor(Math.random()*(this.CardPool.length + this.BonusCardPool.length));
    
    return (PushValue);
  }
  
  /**
   * Peeks at the next card, without removing it from the deck.
   */
  this.PeekCard = function(){
    var PeekValue;
    if (NextVal>CardPool.length){
      PeekValue = this.BonusCardPool[this.NextVal - this.CardPool.length];
    }
    else{
      PeekValue = this.CardPool[this.NextVal];
    }
  }
  
  /**
   * @return integer
   *   Returns the size of the deck for this level.
   */
  this.GetNumberOfCards = function(){
    return(CardPool.length + BonusCardPool.length);
  }
  
  /**
   * @return bool
   *   Returns whether the last card drawn was a bonus card or not.
   */
  this.LastBonus = function(){
    return(this.LastBonusBool);
  }
  
  /**
   * @return bool
   *   Returns whether the next card to be drawn will be a bonus card or not.
   */
  this.NextBonus = function(){
    if (NextVal>CardPool.length){
      return(true);
    }
    else{
      return(false);
    }
  }
  
  /**
   * @return integer
   *   Returns a random bonus card, within the appropriate range.
   */
  this.GetRandomBonus = function(){
    return(SCHWARTZID+Math.floor(Math.random()*BONUSES));
  }
}