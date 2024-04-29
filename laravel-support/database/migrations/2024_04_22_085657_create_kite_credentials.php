<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateKiteCredentials extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('kite_credentials', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');

            $table->string('api_key');
            $table->string('api_secret');
            $table->string('access_token')->nullable();

            $table->string('request_token')->nullable();

            $table->integer('is_expired');

            $table->dateTime('created_at')->useCurrent();
            $table->dateTime('updated_at')->useCurrent()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('kite_credentials');
    }
}
