<?php


require_once "dirLoader.php";
require_once "contentFormat.php";


$txt_dir='json';

$table_headers= ['filename', 'filetype', 'link'];

$dir = new DirLoader;

$texts = $dir->get_dir_content($txt_dir);

$format = new ContentFormat();


$texts_table = $format->get_table_content($texts, $table_headers);


require_once "htmlHeader.php";

require_once "htmlSections.php";

echo '<div id="content">'.$texts_table.'</div>';

//require html footer
require_once "htmlFooter.php";





?>