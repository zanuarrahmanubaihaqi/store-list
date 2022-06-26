<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTblResto extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::disableForeignKeyConstraints();

        Schema::create('tbl_resto', function (Blueprint $table) {
            $table->id('resto_id')->unsigned();
            $table->string('resto_name', 250);
            $table->integer('resto_is_deleted', false, false, 2);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('tbl_resto', function (Blueprint $table) {
            $table->index(['resto_id', 'resto_name']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        $table->dropIndex('resto_id');
        $table->dropIndex('resto_name');
        
        Schema::dropIfExists('tbl_resto');
    }
}
