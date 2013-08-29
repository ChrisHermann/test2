<?php
	$dbhost = 'host';
	$dbuser = 'user';
	$dbpass = 'pass';
	
	$con = mysql_connect($dbhost, $dbuser, $dbpass);
	if (!$con) die('Error connecting to mysql');
	if (!mysql_select_db("db", $con)) die(mysql_error());
	
	
	$now = new DateTime;
	$now->modify( '+1 hour' );
	$now2=date_format($now, "Y-m-d H:i:s");
	
	
	$sql="INSERT INTO Mem_highscore (H_Date, H_Name, H_Score) VALUES ('$now2', '$_POST[Name]', '$_POST[Score]') ";
	
	if (!mysql_query($sql,$con))
	{
		$Error=mysql_error();
		die('Error: ' . $Error);
	}
    
    die('DONE');
	
?>