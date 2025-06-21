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
        Schema::create('operations', function (Blueprint $table) {
            $table->id();
            $table->date('operation_date_at');
            $table->string('complication');
            $table->text('post_op_care');
            $table->text('notes');
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('operation_type_id');
            $table->unsignedBigInteger('anesthesia_type_id');

            $table->foreign('patient_id')->references('id')->on('patients')->onDelete('cascade');
            $table->foreign('operation_type_id')->references('id')->on('operation_types')->onDelete('cascade');
            $table->foreign('anesthesia_type_id')->references('id')->on('anesthesia_types')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operations');
    }
};
