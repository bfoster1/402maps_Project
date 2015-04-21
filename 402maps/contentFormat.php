<?php

//handles contents and renders the file 

class ContentFormat{
 private static $viewer_content;
 private static $table_headers;
 private static $table_header_cells;
 private static $table_rows;



 function get_table_content($content, $headers)
 {


 		$this->format_table($content, $headers);

 		return self:: $viewer_content;


 }


 function format_table($content, $headers)
 {
 	foreach ($headers as $key=>$val)
 	{

 		self:: $table_header_cells .= '<th>'.$val.'</th>';

 	}


 	self::$table_headers = '</tr>'.self::$table_header_cells.'</tr>';

 	foreach ($content as $key=>$val)
 	{

 		$fileintfo = pathinfo($val);
 		$filename = $fileintfo['filename'];
 		$fileext =$fileintfo['extension'];

        $filelink = '<a href="content.php?name='.$filename.'&type='.$fileext.'">view file</a>';
         self::$table_rows .= '<tr><td>'.str_replace('_', ' ', $filename).'</td><td>'.$fileext.'</td><td>'.$filelink.'</td></tr>';


 	} 

 	 self::$viewer_content = '<table id="data" class="table table-bordered">'.self::$table_headers.self::$table_rows.'</table>';


 }







}




?>