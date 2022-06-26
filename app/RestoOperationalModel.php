<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class RestoOperationalModel extends Model
{
    protected $table = 'tbl_resto_operational';
    protected $primaryKey = 'ro_id';
    protected $fillable = [
        'ro_id', 'ro_resto_id', 'ro_day', 'ro_open_hour', 'ro_open_minute', 'ro_close_hour', 'ro_close_minute', 'ro_open_time_identifier', 'ro_close_time_identifier', 'updated_at', 'created_at'
    ];

    public static function getDetailResto($resto_id)
    {
        $data = DB::select('
                SELECT 
                    a.resto_id, 
                    a.resto_name, 
                    a.created_at, 
                    b.ro_id, 
                    b.ro_resto_id, 
                    b.ro_day, 
                    b.ro_open_hour,
                    b.ro_open_minute,
                    b.ro_close_hour,
                    b.ro_close_minute,
                    b.ro_open_time_identifier,
                    b.ro_close_time_identifier
                FROM tbl_resto a
                LEFT JOIN tbl_resto_operational b ON b.ro_resto_id = a.resto_id
                WHERE a.resto_id = ' . $resto_id
            );
        
        return $data;
    }

    public static function saveData($data)
    {
        $result = false;
        DB::beginTransaction();
        try {
            if (RestoOperationalModel::create($data)) {
                $result = true;
            }
            DB::commit();
            return $result;
        } catch (QueryException $e) {
            DB::rollback();
            $get_last_id = RestoOperationalModel::select('ro_id')
                            ->orderByDesc('ro_id')
                            ->first();
            if ($get_last_id != null) {
                $id = $get_last_id->ro_id;
            } else {
                $id = 0;
            }
            $data['ro_id'] = $id + 1;
            self::saveData($data);
            $result = false;
        }
    }
}
