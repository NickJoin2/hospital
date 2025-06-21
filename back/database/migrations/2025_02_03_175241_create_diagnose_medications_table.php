<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('diagnose_medications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('diagnose_id');
            $table->unsignedBigInteger('medication_id');

            $table->foreign('diagnose_id')->references('id')->on('diagnoses')->onDelete('cascade');
            $table->foreign('medication_id')->references('id')->on('medications')->onDelete('cascade');
            $table->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('diagnose_medications');
    }
};
