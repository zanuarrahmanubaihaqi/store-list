<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\user;
use App\OrderReport;
use DataTables;
use DB;

class OrderReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $orderreport = OrderReport::getReportData();
        $user = User::all();

        return view('orderreport.index', compact('orderreport', 'user'));
    }

    public function getReportDataByIdAndTime($start_date, $end_date, $user_id)
    {
        // $data = OrderReport::getReportDataByIdAndTime($start_date, $end_date, $user_id);
        
        // return $data;

        $start = date("Y-m-d H:i:s", strtotime($start_date . "00:00:00"));
        $end = date("Y-m-d H:i:s", strtotime($end_date . "23:59:00"));
        return DataTables::of(
                DB::select('
                    SELECT
                        a.*,
                        o.order_desc
                    FROM order_report a
                    LEFT JOIN `order` o ON o.order_id = a.or_order_id
                    WHERE a.or_user_id = ' . $user_id . ' AND a.created_at BETWEEN "' . $start . '" AND "' . $end . '"
                ')
        )->make(true);
    }
}
