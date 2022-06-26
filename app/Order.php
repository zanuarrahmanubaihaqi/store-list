<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class Order extends Model
{
    protected $table = 'order';
    protected $primaryKey = 'order_id';
    public $guarded = [];

    public static function getOrderData() {
        $data = DB::table('order')
                ->select('*')
                ->orderByDesc('order_id')->get();
        return $data;
    }

    public static function getOrderDataByUserId($user_id) {
        $data = DB::table('order')
                ->select('*')
                ->where('order_user_id', '=', $user_id)
                ->orderByDesc('order_id')->get();
        return $data;
    }

    public static function getLastTransactionId() {
        $data = DB::table('order')
                ->select('order_id')
                ->groupBy('order_id')
                ->orderByDesc('order_id')
                ->first();
        return isset($data) ? $data->order_id : 0;   
    }

    public static function saveData($data)
    {
        $result = false;
        DB::beginTransaction();
        try {
            if (Order::create($data)) {
                $result = true;
            }
            DB::commit();
            return $result;
        } catch (QueryException $e) {
            DB::rollback();
            $get_last_id = $this->getLastId();
            if ($get_last_id != null || $get_last_id != 0) {
                $id = $get_last_id->order_id;
            } else {
                $id = 0;
            }
            $data['order_id'] = $id + 1;
            self::saveData($data);
            $result = false;
        }
    }

    public static function getLastId() {
        $last_id = Order::select('order_id')
                    ->orderByDesc('order_id')
                    ->first();
        if ($last_id != null) {
            $id = $last_id->order_id;
        } else {
            $id = 0;
        }

        return $id;
    }

    public static function setPoint($user_id, $amount) {
        $a = $b = $c = 0;
        if (($amount > 0) || ($amount <= 50000)) {
            $a = 0;
        }
        if (($amount > 50000) || ($amount <= 100000)) {
            $b = (50000 / 2000) * 1;
        }
        if ($amount > 100000) {
            $c = (($amount - 100000) / 2000) * 2;
        }

        $point = $a + $b + $c;

        return (int) $point;
    }
}
