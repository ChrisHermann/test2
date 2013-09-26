/**
 * @file
 * @todo explain
 */
function GFX(node, image)
{
  //This card is used to easily make
  this.node = node;
  this.image = image;
  this.StartSize;
  this.EndSize;
  this.StartAlpha;
  this.EndAlpha;
  this.StartPosition;
  this.EndPosition;
  //Should be remade to time!
  this.Steps;
  
  this.StepSize;
  this.StepAlpha;
  this.StepPosition;
  this.Callback;
  this.HasCallback = false;
  this.WIDTH=0;
  this.HEIGHT=0;
  
  /**
   * Sets up the functions.
   *
   * @param var StartSize
   *   Starting size as a decimal number. 1 for 100%.
   * @param var EndSize
   *   End size.
   * @param var StartAlpha
   *   Starting alpha, as decimal number. 1 for 100%.
   * @param var EndAlpha
   *   End alpha.
   * @param var StartPosition
   *   Starting position as an object e.g. {x: 5, y: 5}
   * @param var EndPosition
   *   End position.
   * @param var steps
   *   How many seconds the transition should take.
   */
  this.Create = function(StartSize, EndSize, StartAlpha, EndAlpha, StartPosition, EndPosition, steps)
  {
    /**
	 * the three first arguments has a starting value and an end value.
     * They will transition from the first value to the second one over time.
     * Size is the size of the object.
     * Alpha is the opacity
     * Position is an object given as: {x: , y:} with coordinates.
     * Steps is the amount of seconds the transaction should take.
     */
    this.Steps = (steps * 1000);
    
    this.StartSize = StartSize;
    this.EndSize = EndSize;
    this.StepSize = (EndSize-StartSize)/this.Steps;
    
    this.StartAlpha= StartAlpha;
    this.EndAlpha = EndAlpha;
    this.StepAlpha = (EndAlpha-StartAlpha)/this.Steps;
    
    this.StartPosition = StartPosition;
    this.EndPosition = EndPosition;
    this.StepPosition = {x: (EndPosition.x-StartPosition.x)/this.Steps, y: (EndPosition.y-StartPosition.y)/this.Steps};
  }
  
  this.SetSize = function(w, h)
  {
    this.WIDTH=w;
    this.HEIGHT=h;
  }
  
  /**
   * The step function that transitions stuff.
   * It all does the same, just with different variables.
   * take the base amount, and increase it by the step amount.
   * If the base amount is greater than the end-amount, then hard-set the step amount to the end-amount.
   */
  this.Step = function()
  {
    this.StartSize+=this.StepSize * Delta;
    if ((this.StartSize>this.EndSize && this.StepSize>0) || (this.StartSize<this.EndSize && this.StepSize<0)) this.StartSize=this.EndSize;
    
    
    this.StartAlpha+=this.StepAlpha * Delta;
    if ((this.StartAlpha>this.EndAlpha && this.StepAlpha>0) || (this.StartAlpha<this.EndAlpha && this.StepAlpha<0)) this.StartAlpha=this.EndAlpha;
    
    this.StartPosition.x+=this.StepPosition.x * Delta;
    if ((this.StartPosition.x>this.EndPosition.x && this.StepPosition.x>0) || (this.StartPosition.x<this.EndPosition.x && this.StepPosition.x<0)) this.StartPosition.x=this.EndPosition.x;
    
    
    this.StartPosition.y+=this.StepPosition.y * Delta;
    if ((this.StartPosition.y>this.EndPosition.y && this.StepPosition.y>0) || (this.StartPosition.y<this.EndPosition.y && this.StepPosition.y<0)) this.StartPosition.y=this.EndPosition.y;
    
    if (this.WIDTH!=0)
    {
      this.node.css({opacity: this.StartAlpha, left:this.StartPosition.x, top: this.StartPosition.y, width: this.WIDTH, height: this.HEIGHT});
      this.image.css({width: this.WIDTH * this.StartSize, height: this.HEIGHT * this.StartSize});
      
    }
    else
    {
      this.node.css({opacity: this.StartAlpha, left:this.StartPosition.x, top: this.StartPosition.y, width: this.WIDTH * this.StartSize, height: this.HEIGHT * this.StartSize});
    }
    
    if (this.StartSize == this.EndSize
    && this.StartAlpha == this.EndAlpha
    && this.StartPosition.x == this.EndPosition.x
    && this.StartPosition.y == this.EndPosition.y)
    {
      this.Despawn();
    }
  }
  /**
   * Despawns the animation.
   */
  this.Despawn = function()
  {
    if (this.HasCallback)
    this.Callback.apply(this);
    
    this.node.remove();
  }
  
  /**
   * Calls the function when the object is about to Despawn
   * This is if you want a functino to run once the object despawns.
   */
  this.EndCall = function(Function)
  {
    this.Callback = Function;
    this.HasCallback = true;
  }
}