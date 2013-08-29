function ImageManager()
{
	//This class will manage Images
	//This will make it easier to change the images for future games.
	this.Faces = new Array();
	this.BFace;
	
	//Sets up the necessary variables.
	this.Create = function(BackFaceURL)
	{
		//This only takes the backface as argument.
		this.BFace = new $.gameQuery.Animation({
        imageURL: BackFaceURL});
	}

	//Loads a new image, and stores it as a face.
	this.Load = function(URL)
	{
		this.Faces[this.Faces.length] = new $.gameQuery.Animation({
        imageURL: URL});
		
		return(this.Faces.length-1);
	}
	
	//Gets the image with a given index.
	this.GetImage = function(Number)
	{
		return(this.Faces[Number]);
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