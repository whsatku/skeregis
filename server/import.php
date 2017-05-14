<?php
if(php_sapi_name() != "cli"){
	echo 'CLI access only';
	die();
}
require_once __DIR__.'/vendor/autoload.php';
require_once "database.php";

use Regis\Model\Register;

$source = fopen('ske-all-2013.csv', 'r');

date_default_timezone_set('Asia/Bangkok');

while(!feof($source)){
	$l = fgetcsv($source, 0, "\t");
	Register::create(array(
		'name' => $l[0].' '.$l[1],
		'lastname' => $l[2],
		'branch' => $l[3],
		'year' => (int) $l[4]
	));
}