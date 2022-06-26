<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Level extends Model
{
    protected $table = 'tbl_user_level';
    protected $primaryKey = 'id_level';
    public $timestamps = false;

    public function user() {
      return $this->hasOne(User::class);
    }
}
