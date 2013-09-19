/**
 * @file
 * This class will manage Images
 * This will make it easier to change the images for future games.
 */
function ImageManager()
{
  this.Faces = new Array();
  this.BFace;
  this.Misc = new Array();
  
  /**
   * Sets up the necessary variables.
   * @param string BackFaceURL
   *   The path to the Background of the cards
   */
  this.Create = function(BackFaceURL)
  {
    //This only takes the backface as argument.
    this.BFace = new $.gameQuery.Animation({
      imageURL: BackFaceURL});
  }

  /**
   * Loads a new image, and stores it as a face.
   * 
   * @param string URL
   *   the path to the cardface image
   * 
   * @return integer
   *   returns the id of the newly loaded image. 
   */
  this.LoadCard = function(URL)
  {
    this.Faces[this.Faces.length] = new $.gameQuery.Animation({
      imageURL: URL});
    
    return(this.Faces.length-1);
  }
  
  /**
   * Loads a new image, and stores it as a misc Image.
   * @param string URL
   *   the path to the image
   * 
   * @return integer
   *   returns the id of the newly loaded image. 
   */
  this.LoadMisc = function(URL)
  {
    this.Misc[this.Misc.length] = new $.gameQuery.Animation({
      imageURL: URL});
    
    return(this.Misc.length-1);
  }
  
  /**
   * Gets the image with a given index.
   * 
   * @param integer Number
   *   the given index
   * 
   * @return string
   *   Returns the image
   */
  this.GetCard = function(Number)
  {
    return(this.Faces[Number]);
  }
  /**
   * Gets the image with a given index.
   * 
   * @param integer Number
   *   the given index
   * 
   * @return string
   *   Returns the image
   */
  this.GetMisc = function(Number)
  {
    return(this.Misc[Number]);
  }
  
  /**
   * gets the image for the backside of the card
   * 
   * @return string
   *   Returns the image
   */
  this.GetBack = function()
  {
    return(this.BFace);
  }
  
  /**
   * @todo Get the total amount of normal cards.
   * 
   * @return integer
   *   Returns the total amount of normal cards.
   */
  this.GetTotal = function()
  {
    return(this.Faces.length-BONUSES);
  }
}