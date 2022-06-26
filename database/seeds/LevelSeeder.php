<?php

use Illuminate\Database\Seeder;
use App\Level;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $arr_ket = ["administrator", "user"];
        for ($i = 0; $i < 2; $i++) { 
            Level::create([
                'level' => $i + 1,
                'keterangan' => $arr_ket[$i],
                'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }
}
