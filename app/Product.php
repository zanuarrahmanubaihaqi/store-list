<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Product extends Model
{
    protected $table = 'product';
    protected $primaryKey = 'product_id';
    public $guarded = [];

    public static function getProductData()
    {
        $data = DB::table('product')
                ->select('*')
                ->orderByDesc('product_id')->get();
                
        return $data;
    }
}
