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
        Schema::create('reclassements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('agents')->onDelete('cascade'); // Relation avec la table agents
            $table->foreignId('ancienne_categorie_id')->constrained('categories')->onDelete('cascade'); // Clé étrangère vers la table categories pour l'ancienne catégorie
            $table->foreignId('nouvelle_categorie_id')->constrained('categories')->onDelete('cascade'); // Clé étrangère vers la table categories pour la nouvelle catégorie
            $table->date('date_reclassement');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reclassements');
    }
};
