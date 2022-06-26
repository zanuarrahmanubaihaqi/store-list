<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use DB;

class RestoModel extends Model
{
    protected $table = 'tbl_resto';
    protected $primaryKey = 'resto_id';
    protected $fillable = [
        'resto_id', 'resto_name', 'resto_is_deleted', 'updated_at', 'created_at', 'deleted_at'
    ];

    public static function getRestoData() {
        $data = DB::table('tbl_resto')
                ->select('*')
                ->orderBy('resto_id')->get();

        return $data;
    }

    public static function saveData($data)
    {
        $result = false;
        DB::beginTransaction();
        try {
            if (RestoModel::create($data)) {
                $result = true;
            }
            DB::commit();
            return $result;
        } catch (QueryException $e) {
            DB::rollback();
            $get_last_id = RestoModel::select('resto_id')
                            ->orderByDesc('resto_id')
                            ->first();
            if ($get_last_id != null) {
                $id = $get_last_id->resto_id;
            } else {
                $id = 0;
            }
            $data['resto_id'] = $id + 1;
            self::saveData($data);
            $result = false;
        }
    }
}
