<?php
    $dbhost = 'host';
    $dbuser = 'user';
    $dbpass = 'password';
    
    $con = mysql_connect($dbhost, $dbuser, $dbpass);
    if (!$con) die('Error connecting to mysql');
    if (!mysql_select_db("db", $con)) die(mysql_error());
    
    $result = mysql_query("SELECT H_Name, H_Score FROM Mem_highscore ORDER BY H_Score DESC LIMIT 10");
    
    $filesArray = array();
    $i = 0;
    while($row = mysql_fetch_array($result))
    {
        $filesArray[$i*2]=$row[H_Name];
        $filesArray[$i*2+1]=$row[H_Score];
        $i++;
    }
    
    
    echo json_encode($filesArray); 
?>