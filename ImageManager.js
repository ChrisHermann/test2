function ImageManager()
{
	//This class will manage Images
	//This will make it easier to change the images for future games.
	this.Faces = new Array();
	this.BFace;
	
	
	this.Create = function(BackFaceURL)
	{
		this.BFace = new $.gameQuery.Animation({
        imageURL: BackFaceURL});
	}

	this.Load = function(URL)
	{
		this.Faces[this.Faces.length] = new $.gameQuery.Animation({
        imageURL: URL});
	}
	
	this.GetImage = function(Number)
	{
		return(this.Faces[Number]);
	}
	
	this.GetBack = function()
	{
		return(this.BFace);
	}
}