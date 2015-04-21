<?php

require_once "htmlHeader.php";

if (isset($_GET['name']) && isset($_GET['type'])) {
$content_name = $_GET['name'];
$content_type = $_GET['type'];

require_once $content_type.'Reader.php';

$reader_class = ucfirst($content_type).'Reader';
$reader = new $reader_class;

$content = $reader->get_render($content_name, $content_type);

echo '<div id="mini_menu"><a href="./">Home</a></div>';
echo '<button onclick="myfunction1()">Center Content</button>';
echo '<button onclick="myfunction()">Content Shadow</button>';
echo '<button onclick="myfunction2()">Content Weight</button>';
echo '<button onclick="myfunction3()">Text Size</button>';
echo '<script>function myfunction(){
    		document.getElementById("content").style.textShadow="1px 2px gray";}

    		function myfunction1(){
    		document.getElementById("content").style.textAlign="center";}

    		function myfunction2() {
    document.getElementById("content").style.fontWeight = "900";}

    function myfunction3() {
    document.getElementById("content").style.fontSize = "x-large";
}

   

</script>';
/*echo '<script>$(document).ready(function(){
    $("button").click(function(){
        $("#content").hide();
    });</script>' ;*/

echo '<div id="content">'.$content.'</div>';
}
else {
echo 'No content found. Please return to <a href="./">home page</a>';
}
//require html footer
require_once "htmlFooter.php";
?>






