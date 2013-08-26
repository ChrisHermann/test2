function GFX(node)
{
	//This class will manage the deck
	//It will be used to set up the current levels and
	//Make it easier to manage which cards are
	//still available
	
	this.node = node;
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
	
	this.Create = function(SS, ES, SA, EA, SP, EP, steps)
	{
		this.Steps = steps;
		
		this.StartSize = SS;
		this.EndSize = ES;
		this.StepSize = (ES-SS)/steps;
		
		this.StartAlpha= SA;
		this.EndAlpha = EA;
		this.StepAlpha = (EA-SA)/steps;
		
		this.StartPosition = SP;
		this.EndPosition = EP;
		this.StepPosition = {x: (EP.x-SP.x)/steps, y: (EP.y-SP.y)/steps};
	}
	
	this.Step = function()
	{
		this.StartSize+=this.StepSize;
		if ((this.StartSize>this.EndSize && this.StepSize>0) || (this.StartSize<this.EndSize && this.StepSize<0)) this.StartSize=this.EndSize;
		
		
		this.StartAlpha+=this.StepAlpha;
		if ((this.StartAlpha>this.EndAlpha && this.StepAlpha>0) || (this.StartAlpha<this.EndAlpha && this.StepAlpha<0)) this.StartAlpha=this.EndAlpha;
		
		this.StartPosition.x+=this.StepPosition.x;
		if ((this.StartPosition.x>this.EndPosition.x && this.StepPosition.x>0) || (this.StartPosition.x<this.EndPosition.x && this.StepPosition.x<0)) this.StartPosition.x=this.EndPosition.x;
		
		
		this.StartPosition.y+=this.StepPosition.y;
		if ((this.StartPosition.y>this.EndPosition.y && this.StepPosition.y>0) || (this.StartPosition.y<this.EndPosition.y && this.StepPosition.y<0)) this.StartPosition.y=this.EndPosition.y;
		
		this.node.scale(this.StartSize).xy(this.StartPosition.x, this.StartPosition.y).css({opacity: this.StartAlpha});
	}
	
}