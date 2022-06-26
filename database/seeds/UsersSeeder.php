<?php

use Illuminate\Database\Seeder;
use App\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $i = 0;
        $arr_user = ["admin", "guest"];
        $arr_user_pass = ["admin123", "guest123"];

        for ($i = 0; $i < count($arr_user); $i++) { 
            User::create([
              'name' => $arr_user[$i] . "system",
              'username' => $arr_user[$i],
              'email' => $arr_user[$i] . "root@mail.co.id",
              'password' => bcrypt($arr_user_pass[$i]),
              'level' => $i + 1,
              'remember_token' => Str::random(10),
              'created_at' => date('Y-m-d H:i:s')
            ]);
        }
    }
}
