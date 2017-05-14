<?php
if(php_sapi_name() != "cli"){
	echo 'CLI access only';
	die();
}
require_once __DIR__.'/vendor/autoload.php';
require_once "database.php";

use Illuminate\Database\Capsule\Manager as Capsule;

if(!Capsule::schema()->hasTable('registers')){
	Capsule::schema()->create('registers', function($table){
		$table->increments('id');
		$table->string('name');
		$table->string('lastname');
		$table->string('nick');
		$table->string('branch');
		$table->smallInteger('year');
		$table->datetime('arrived')->nullable();
		$table->timestamps();
		$table->softDeletes();
	});
	echo "created registers\n";
}