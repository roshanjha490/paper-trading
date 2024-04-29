<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->integer('instrument_token');

            $table->integer('purchased_at')->nullable();
            $table->integer('quantity_purchased')->nullable();
            $table->integer('purchased_amt')->nullable();

            $table->integer('sold_at')->nullable();
            $table->integer('quantity_sold')->nullable();
            $table->integer('sold_amt')->nullable();

            $table->integer('order_id')->nullable();

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
        Schema::dropIfExists('orders');
    }
}
