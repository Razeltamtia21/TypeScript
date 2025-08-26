<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('loan_outstandings', function (Blueprint $table) {
            $table->id();
            $table->string('entity_number');
            $table->string('account_number');
            $table->string('debitor_name');
            $table->string('gl_account');
            $table->string('loan_type');
            $table->string('gl_group');
            $table->date('original_date');
            $table->integer('term_months');
            $table->date('maturity_date');
            $table->decimal('interest_rate', 5, 2);
            $table->decimal('payment_amount', 15, 2);
            $table->decimal('eir_amortised_cost_exposure', 15, 2);
            $table->decimal('eir_amortised_cost_calculated', 15, 2);
            $table->decimal('current_balance', 15, 2);
            $table->decimal('carrying_amount', 15, 2);
            $table->decimal('outstanding_receivable', 15, 2);
            $table->decimal('outstanding_interest', 15, 2);
            $table->decimal('cumulative_time_gap', 15, 2);
            $table->decimal('unamortized_transaction_cost', 15, 2);
            $table->decimal('unamortized_upfront_fee', 15, 2);
            $table->decimal('unearned_interest_income', 15, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('loan_outstandings');
    }
};