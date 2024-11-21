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
        Schema::create('service_rendus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('agents');
            $table->string('poste_occupe');
            $table->string('lieu');
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->foreignId('reference_id')->constrained('references_reglementaires');
            $table->enum('status', ['active', 'completed', 'pending'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_rendus');
    }
};
