<?php
header('Access-Control-Allow-Origin: *');
if (isset($_GET) && isset($_GET['id']) && $_GET['id'] != 0)
{
	$user = $_GET['user'];
	$id = $_GET['id'];
	if ($id == -1)
	{
		echo file_get_contents("https://www.instagram.com/$user/media/");
	}
	else
	{
		echo file_get_contents("https://www.instagram.com/$user/media/?max_id=$id");
	}
}
else
{
	$user = $_GET['user'];
	// echo file_get_contents("https://www.instagram.com/$user/media/");
	readfile('res/json.json');
}
?>
