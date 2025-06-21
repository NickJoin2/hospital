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
        Schema::create('worker_education', function (Blueprint $table) {
            $table->id();
            $table->date('year_start');
            $table->date('year_end');
            $table->boolean('is_not_finished')->nullable();
            $table->string('educational_institution');

            $table->unsignedBigInteger('specialization_id');
            $table->unsignedBigInteger('education_level_id');
            $table->unsignedBigInteger('worker_id');

            $table->foreign('specialization_id')->references('id')->on('specializations')->onDelete('cascade');
            $table->foreign('education_level_id')->references('id')->on('education_levels')->onDelete('cascade');
            $table->foreign('worker_id')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('worker_education');
    }
};
