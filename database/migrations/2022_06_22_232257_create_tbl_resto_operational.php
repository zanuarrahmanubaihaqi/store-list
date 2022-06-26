<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblRestoOperational extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('tbl_resto_operational', function (Blueprint $table) {
            $table->id('ro_id', 11);
            $table->integer('ro_resto_id', false, false)->unsigned();
            $table->string('ro_day', 10);
            $table->integer('ro_open_hour', false, false, 3);
            $table->integer('ro_open_minute', false, false, 3);
            $table->integer('ro_close_hour', false, false, 3);
            $table->integer('ro_close_minute', false, false, 3);
            $table->string('ro_open_time_identifier', 4);
            $table->string('ro_close_time_identifier', 4);
            $table->timestamps();
        });

        Schema::table('tbl_resto_operational', function (Blueprint $table) {
            $table->index('ro_id');
            $table->index('ro_resto_id');
            $table->index('ro_day');
            $table->index('ro_open_hour');
            $table->index('ro_close_hour');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $table->dropIndex(['ro_id']);
        $table->dropIndex(['ro_resto_id']);
        $table->dropIndex(['ro_day']);
        $table->dropIndex(['ro_open_hour']);
        $table->dropIndex(['ro_close_hour']);
        
        Schema::dropIfExists('tbl_resto_operational');
    }
}
