function GFX(node)
{
	//This card is used to easily make 
	
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
	this.Callback;
	this.Hascb = false;
	
	//Sets up the functions.
	this.Create = function(SS, ES, SA, EA, SP, EP, steps)
	{
		//the three first arguments has a starting value and an end value.
		//They will transition from the first value to the second one over time.
		//Size is the size of the object.
		//Alpha is the opacity
		//Position is an object given as: {x: , y:} with coordinates.
		//Steps is the amount of time the transition should take.
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
	
	//The step function that transitions stuff.
	//It all does the same, just with different variables.
	//take the base amount, and increase it by the step amount.
	//If the base amount is greater htan the end-amount, then hard-set the step amount to the end-amount.
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
		
		
		//NEEDS TO BE ABLE TO DELETE ITSELF
		
		if (this.StartSize == this.EndSize
		&& this.StartAlpha == this.EndAlpha
		&& this.StartPosition.x == this.EndPosition.x
		&& this.StartPosition.y == this.EndPosition.y)
		{
			this.Depsawn();
		}
	}
	
	this.Depsawn = function()
	{
		if (this.Hascb)
		this.Callback.apply(this);
		
		this.node.remove();
		//Unsure if this part is necessary?
		$(this.node.id).remove();
	}
	
	//Calls the function when the object is about to despawn
	this.EndCall = function(Function)
	{
		this.Callback = Function;
		this.Hascb = true;
	}
}