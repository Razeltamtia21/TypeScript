<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoanTempTable extends Migration
{
    public function up()
    {
        Schema::create('loan_temp_data', function (Blueprint $table) {
            $table->id();
            $table->index('session_id'); // Tambahkan index
            $table->string('no_acc', 50);
            $table->string('no_branch', 20)->nullable();
            $table->string('deb_name');
            $table->string('status', 50)->nullable();
            $table->string('ln_type', 50)->nullable();
            $table->date('org_date')->nullable();
            $table->string('term', 20)->nullable();
            $table->date('mtr_date')->nullable();
            $table->decimal('org_bal', 15, 2)->default(0);
            $table->decimal('rate', 5, 2)->default(0);
            $table->decimal('cbal', 15, 2)->default(0);
            $table->timestamps();

            $table->index('session_id');
        });
    }

    public function down()
    {
        Schema::table('loan_temp_data', function (Blueprint $table) {
            $table->dropIndex(['session_id']);
        });
    }
}
