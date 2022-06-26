<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTableUserLevel extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('tbl_user_level', function (Blueprint $table) {
            $table->increments('id_level');
            $table->integer('level', false, false)->unsigned();
            $table->string('keterangan', 50);
            $table->timestamps();
        });

        Schema::table('tbl_user_level', function (Blueprint $table) {
            $table->index(['level']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $table->dropIndex(['level']);

        Schema::dropIfExists('tbl_user_level');
    }
}
