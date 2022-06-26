<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLogingTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loging', function (Blueprint $table) {
            $table->id('id', 11);
            $table->integer('user_id', false, false, 11)->nullable();
            $table->text('request')->nullable();
            $table->text('response')->nullable();
            $table->text('action')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('loging');
    }
}
