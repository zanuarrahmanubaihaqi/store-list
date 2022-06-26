<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Loging extends Model
{
    protected $table = 'loging';
    protected $primaryKey = 'id';
    public $guarded = [];
}
