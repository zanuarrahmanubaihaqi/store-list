<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Loging;
use App\User;
use App\RestoModel;
use App\RestoOperationalModel;
use DataTables;
use DB;

class RestoController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $resto = RestoModel::getRestoData();
        $user = User::all();
        $user_level = auth()->user()->level;

        return view('resto.index', compact('resto', 'user', 'user_level'));
    }

    public function getFilteredData($jsondata)
    {
        /*
          "ro_resto_name" : restoName, 
          "ro_open_hour" : openHour, 
          "ro_open_minute" : openMinute, 
          "ro_open_identifier" : openIdentifier, 
          "search_date" : searchDate, 
          "ro_close_hour" : closeHour, 
          "ro_close_minute" : closeMinute, 
          "ro_close_identifier" : closeIdentifier
        */
        $data = json_decode($jsondata);

        $condition = "WHERE ";

        if ($data->ro_resto_name) {
            $condition .= " a.resto_name LIKE '%" . $data->ro_resto_name . "%'";
        }

        if ($data->search_date) {
            $day = date("D", strtotime($data->search_date));            
            $h = date("H", strtotime($data->search_date));

            if ($h >= 12) {
                $time_identifier = "pm";
                $hour = (int) $h - 11; 
            } else {
                $time_identifier = "am";
                $hour = $h;
            }
            
            $minute = date("i", strtotime($data->search_date));

            if ($data->ro_resto_name) {
                $condition .= " AND b.ro_day = '" . $day . "'";    
            } else {
                $condition .= " b.ro_day = '" . $day . "'";
            }
        }

        if ($data->ro_open_identifier) {
            if ($data->ro_resto_name || $data->search_date) {
                $condition .= " AND b.ro_open_time_identifier = '" . $data->ro_open_identifier . "' AND b.ro_open_hour >= " . $data->ro_open_hour . " AND IF(b.ro_open_hour = " . $data->ro_open_hour . ", ro_open_minute <= " . $data->ro_open_minute . ", ro_open_minute <= 0)";
            } else {
                $condition .= " b.ro_open_time_identifier = '" . $data->ro_open_identifier . "' AND b.ro_open_hour >= " . $data->ro_open_hour . " AND IF(b.ro_open_hour = " . $data->ro_open_hour . ", ro_open_minute <= " . $data->ro_open_minute . ", ro_open_minute <= 0)";
            }
        }

        if ($data->ro_close_identifier) {
            if ($data->ro_close_identifier == $data->ro_close_identifier) {
                if ($data->ro_resto_name || $data->search_date) {
                    $condition .= " AND b.ro_open_time_identifier = '" . $data->ro_open_identifier . "' AND b.ro_close_hour >= " . $data->ro_close_hour . " AND IF(b.ro_close_hour = " . $data->ro_close_hour . ", ro_close_minute <= " . $data->ro_close_minute . ", ro_close_minute <= 0)";
                } else {
                    $condition .= " b.ro_open_time_identifier = '" . $data->ro_close_identifier . "' AND b.ro_close_hour >= " . $data->ro_close_hour . " AND IF(b.ro_close_hour = " . $data->ro_close_hour . ", ro_close_minute <= " . $data->ro_close_minute . ", ro_close_minute <= 0)";
                }   
            } else {
                if ($data->ro_resto_name || $data->search_date) {
                    $condition .= " AND b.ro_close_time_identifier = '" . $data->ro_close_identifier . "' AND b.ro_close_hour >= " . $data->ro_close_hour . " AND IF(b.ro_close_hour = " . $data->ro_close_hour . ", ro_close_minute <= " . $data->ro_close_minute . ", ro_close_minute <= 0)";
                } else {
                    $condition .= " b.ro_close_time_identifier = '" . $data->ro_close_identifier . "' AND b.ro_close_hour >= " . $data->ro_close_hour . " AND IF(b.ro_close_hour = " . $data->ro_close_hour . ", ro_close_minute <= " . $data->ro_close_minute . ", ro_close_minute <= 0)";
                }
            }
        }

        $condition .= " GROUP BY a.resto_id ORDER BY a.resto_id DESC";

        if ($condition != "") {
            return DataTables::of(
                    // RestoModel::getRestoData()
                    DB::select('
                        SELECT DISTINCT a.*
                        FROM tbl_resto a
                        LEFT JOIN tbl_resto_operational b ON b.ro_resto_id = a.resto_id
                        ' . $condition
                    )
            )->make(true);
        }
    }

    public function getDetailResto($resto_id)
    {
        $data = RestoOperationalModel::getDetailResto($resto_id);
        
        return $data;
    }

    public function store(Request $request) 
    {
        $temp_hari = $request->temp_hari;
        $resto_name = $request->resto_name;
        $arr_day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        $resto_id = 0;
        $start_day = 0;
        $end_day = 0;

        $data_resto = [
            'resto_name' => $resto_name,
            'resto_is_deleted' => 0,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s'),
        ];
        $result_resto = RestoModel::saveData($data_resto);
        // $result_resto = true;

        if ($result_resto) {
            $get_last_id = RestoModel::select('resto_id')
                                ->orderByDesc('resto_id')
                                ->first();
            if ($get_last_id != null) {
                $resto_id = $get_last_id->resto_id;
            } else {
                $resto_id = 1;
            }

            $message = "add data " . $resto_name . " success";
            
            for ($i = 1; $i < ($temp_hari + 1); $i++) {
                $a = "ro_day_open" . $i;
                $b = "ro_day_close" . $i;
                $c = "ro_open_identifier" . $i;
                $d = "ro_open_hour" . $i;
                $e = "ro_open_minute" . $i;
                $f = "ro_close_identifier" . $i;
                $g = "ro_close_hour" . $i;
                $h = "ro_close_minute" . $i;

                $start_day = $request->$a;
                $end_day = $request->$b;
                $open_identifier = $request->$c;
                $open_hour = $request->$d;
                $open_minute = $request->$e;
                $close_identifier = $request->$f;
                $close_hour = $request->$g;
                $close_minute = $request->$h;
                // dd($start_day, $end_day, $open_identifier, $close_identifier, $open_hour, $open_minute, $close_identifier, $close_hour, $close_minute, $i);

                if ($start_day == $end_day) {
                    $data_resto_operational = [
                        'ro_resto_id' => $resto_id,
                        'ro_day' => $arr_day[(int) $start_day - 1],
                        'ro_open_hour' => $open_hour,
                        'ro_open_minute' => $open_minute,
                        'ro_close_hour' => $close_hour,
                        'ro_close_minute' => $close_minute,
                        'ro_open_time_identifier' => $open_identifier,
                        'ro_close_time_identifier' => $close_identifier,
                        'created_at' => date('Y-m-d H:i:s'),
                        'updated_at' => date('Y-m-d H:i:s')
                    ];
                    RestoOperationalModel::saveData($data_resto_operational);
                } else {
                    for ($j = $start_day; $j < ($end_day + 1); $j++) {
                        $data_resto_operational = [
                            'ro_resto_id' => $resto_id,
                            'ro_day' => $arr_day[(int) $j - 1],
                            'ro_open_hour' => $open_hour,
                            'ro_open_minute' => $open_minute,
                            'ro_close_hour' => $close_hour,
                            'ro_close_minute' => $close_minute,
                            'ro_open_time_identifier' => $open_identifier,
                            'ro_close_time_identifier' => $close_identifier,
                            'created_at' => date('Y-m-d H:i:s'),
                            'updated_at' => date('Y-m-d H:i:s')
                        ];
                        RestoOperationalModel::saveData($data_resto_operational);   
                    }
                }
            }
        } else {
            $message = "add data " . $resto_name . " failed";
        }

        Loging::insert([
            'request' => json_encode($data_resto),
            'response' => $result_resto,
            'action' => 'add data resto with id : ' . $resto_id,
            'created_at' => date('Y-m-d H:i:s'),
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        return redirect()->route('resto.index')->with('message', $message);
    }
}
