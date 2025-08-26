<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('loan_recognitions', function (Blueprint $table) {
            $table->id();
            $table->string('entity_number');
            $table->string('account_number');
            $table->string('debitor_name');
            $table->string('gl_account');
            $table->string('loan_type');
            $table->string('gl_group');
            $table->date('original_date');
            $table->integer('term');
            $table->decimal('interest_rate', 5, 2);
            $table->date('maturity_date');
            $table->decimal('payment_amount', 15, 2);
            $table->decimal('original_balance', 15, 2);
            $table->decimal('current_balance', 15, 2);
            $table->decimal('carrying_amount', 15, 2);
            $table->decimal('eir_amortised_cost_exposure', 15, 2);
            $table->decimal('eir_amortised_cost_calculated', 15, 2);
            $table->decimal('eir_calculated_convertion', 15, 2);
            $table->decimal('eir_calculated_transaction_cost', 15, 2);
            $table->decimal('eir_calculated_up_front_fee', 15, 2);
            $table->decimal('outstanding_amount', 15, 2);
            $table->decimal('outstanding_amount_initial_transaction_cost', 15, 2);
            $table->decimal('outstanding_amount_initial_up_front_fee', 15, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('loan_recognitions');
    }
};