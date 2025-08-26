<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tblmaster', function (Blueprint $table) {
            $table->id();
            $table->string('no_acc')->nullable();
            $table->string('no_branch')->nullable();
            $table->string('deb_name')->nullable();
            $table->string('status')->nullable();
            $table->string('ln_type')->nullable();
            $table->string('org_date')->nullable();
            $table->date('org_date_dt')->nullable();
            $table->integer('term')->nullable();
            $table->string('mtr_date')->nullable();
            $table->date('mtr_date_dt')->nullable();
            $table->decimal('org_bal', 18, 2)->nullable();
            $table->decimal('rate', 10, 4)->nullable();
            $table->decimal('cbal', 18, 2)->nullable();
            $table->decimal('prebal', 18, 2)->nullable();
            $table->string('bilprn')->nullable();
            $table->decimal('pmtamt', 18, 2)->nullable();
            $table->string('lrebd')->nullable();
            $table->date('lrebd_dt')->nullable();
            $table->string('nrebd')->nullable();
            $table->date('nrebd_dt')->nullable();
            $table->string('ln_grp')->nullable();
            $table->string('group')->nullable();
            $table->string('bilint')->nullable();
            $table->string('bisifa')->nullable();
            $table->string('birest')->nullable();
            $table->string('freldt')->nullable();
            $table->date('freldt_dt')->nullable();
            $table->string('resdt')->nullable();
            $table->date('resdt_dt')->nullable();
            $table->string('restdt')->nullable();
            $table->date('restdt_dt')->nullable();
            $table->string('prov')->nullable();
            $table->decimal('trxcost', 18, 2)->nullable();
            $table->decimal('gol', 18, 2)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tblmaster');
    }
};
