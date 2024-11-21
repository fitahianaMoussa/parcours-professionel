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
        Schema::create('contrats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['integration', 'reclassement', 'titularisation','avenant signé']);
            $table->date('date_debut');
            $table->date('date_fin')->nullable();
            $table->integer('numero_contrat'); 
            $table->enum('status', ['terminé', 'en cours']);
            $table->boolean('is_renouvele')->default(false);
            $table->date('date_renouvellement')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contrats');
    }
};
