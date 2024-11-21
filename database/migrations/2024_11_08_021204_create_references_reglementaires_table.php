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
        Schema::create('references_reglementaires', function (Blueprint $table) {
            $table->id();
            $table->string('numero');            
            $table->date('date_reference');      
            $table->text('objet')->nullable();               
            $table->enum('type', ['ACTE NOMINATION', 'ARRETE', 'DECISION', 'NOTE DE SERVICE','CONTRAT DE TRAVAIL']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('references_reglementaires');
    }
};
