function ImageManager()
{
	//This class will manage Images
	//This will make it easier to change the images for future games.
	this.Faces = new Array();
	this.BFace;
	this.GFX = new Array();
	
	//Sets up the necessary variables.
	this.Create = function(BackFaceURL)
	{
		//This only takes the backface as argument.
		this.BFace = new $.gameQuery.Animation({
        imageURL: BackFaceURL});
	}

	//Loads a new image, and stores it as a face.
	this.LoadCard = function(URL)
	{
		this.Faces[this.Faces.length] = new $.gameQuery.Animation({
        imageURL: URL});
		
		return(this.Faces.length-1);
	}
	
	//Loads a new image, and stores it as a misc Image.
	this.LoadGFX = function(URL)
	{
		this.GFX[this.GFX.length] = new $.gameQuery.Animation({
        imageURL: URL});
		
		return(this.GFX.length-1);
	}
	
	//Gets the image with a given index.
	this.GetCard = function(Number)
	{
		return(this.Faces[Number]);
	}
	
	//Gets the image with a given index.
	this.GetGFX = function(Number)
	{
		return(this.GFX[Number]);
	}
	
	
	//gets the image for the backside of the card
	this.GetBack = function()
	{
		return(this.BFace);
	}
	
	this.GetTotal = function()
	{
		return(this.Faces.length-BONUSES);
	}
}