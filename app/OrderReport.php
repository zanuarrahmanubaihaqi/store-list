<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class OrderReport extends Model
{
    protected $table = 'order_report';
    protected $primaryKey = 'or_id';
    public $guarded = [];

    public static function saveData($data)
    {
        $result = false;
        DB::beginTransaction();
        try {
            if (OrderReport::create($data)) {
                $result = true;
            }
            DB::commit();
            return $result;
        } catch (QueryException $e) {
            DB::rollback();
            $get_last_id = OrderReport::select('or_id')
                            ->orderByDesc('or_id')
                            ->first();
            if ($get_last_id != null) {
                $id = $get_last_id->or_id;
            } else {
                $id = 0;
            }
            $data['or_id'] = $id + 1;
            self::saveData($data);
            $result = false;
        }
    }

    public static function getReportData()
    {
        $data = DB::table('order_report')
                ->select('order_report.*', 'o.order_desc')
                ->leftJoin('order as o', 'o.order_id', '=', 'order_report.or_order_id')
                ->orderByDesc('order_report.created_at')->get();
                
        return $data;
    }

    public static function getReportDataByIdAndTime($start_date, $end_date, $user_id)
    {
        $start = date("Y-m-d H:i:s", strtotime($start_date . "00:00:00"));
        $end = date("Y-m-d H:i:s", strtotime($end_date . "23:59:00"));

        $data = DB::select('
                SELECT
                    a.*,
                    o.order_desc
                FROM order_report a
                LEFT JOIN `order` o ON o.order_id = a.or_order_id
                WHERE a.or_user_id = ' . $user_id . ' AND a.created_at BETWEEN "' . $start . '" AND "' . $end . '"
            ');


        return $data;
    }
}
