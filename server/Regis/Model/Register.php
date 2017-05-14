<?php

namespace Regis\Model;

use Carbon\Carbon;

class Register extends \Grader\Model\Model{
	public $fillable = array('name', 'lastname', 'nick', 'arrived', 'year', 'branch');

	public function getArrivedAttribute($value){
		if(empty($value)){
			return;
		}
		return (new Carbon($value))->toISO8601String();
	}

	public function setArrivedAttribute($value){
		if($value){
			$this->attributes['arrived'] = Carbon::now();
		}else{
			$this->attributes['arrived'] = null;
		}
	}
}