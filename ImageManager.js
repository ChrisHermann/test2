/**
 * @file
 * This class will manage Images
 * This will make it easier to change the images for future games.
 */
function ImageManager()
{
  this.Faces = new Array();
  this.BackFace;
  this.Misc = new Array();
  
  /**
   * Sets up the necessary variables.
   * @param string BackFaceURL
   *   The path to the Background of the cards
   */
  this.Create = function(BackFaceURL)
  {
    //This only takes the backface as argument.
    this.BackFace = new Image();
	 $(this.BackFace)
    // once the image has loaded, execute this code
    .load(function () {
      // set the image hidden by default    
      $(this).hide();
    })
    
    // if there was an error loading the image, react accordingly
    .error(function () {
      // notify the user that the image could not be loaded
	  console.log("An error has occoured, during loading.");
    })
    
    // *finally*, set the src attribute of the new image to our image
    .attr('src', BackFaceURL);
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
    this.Faces[this.Faces.length] = new Image();
	  $(this.Faces[this.Faces.length-1])
    // once the image has loaded, execute this code
    .load(function () {
      // set the image hidden by default    
      $(this).hide();
    })
    
    // if there was an error loading the image, react accordingly
    .error(function () {
      // notify the user that the image could not be loaded
      console.log("An error has occoured, during loading.");
    })
    
    // *finally*, set the src attribute of the new image to our image
    .attr('src', URL);
	
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
    this.Misc[this.Misc.length] = new Image();
	  $(this.Misc[this.Misc.length-1])
    // once the image has loaded, execute this code
    .load(function () {
      // set the image hidden by default    
      $(this).hide();
    })
    
    // if there was an error loading the image, react accordingly
    .error(function () {
      // notify the user that the image could not be loaded
      console.log("An error has occoured, during loading.");
    })
    
    // *finally*, set the src attribute of the new image to our image
    .attr('src', URL);
	
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
    return(this.Faces[Number].src);
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
    return(this.Misc[Number].src);
  }
  
  /**
   * gets the image for the backside of the card
   * 
   * @return string
   *   Returns the image
   */
  this.GetBack = function()
  {
    return(this.BackFace.src);
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