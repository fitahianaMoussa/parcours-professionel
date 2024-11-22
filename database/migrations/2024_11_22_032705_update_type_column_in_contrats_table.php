<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contrats', function (Blueprint $table) {
            // Ajouter une nouvelle colonne temporaire
            $table->enum('type_new', [
                'premier_contrat',
                'deuxieme_contrat',
                'troisieme_contrat',
                'integration_stage',
                'titularisation',
                'avenant_premiere_annee',
                'avenant_deuxieme_contrat',
                'avenant_troisieme_contrat',
                'integration_direct'
            ])->nullable();
        });

        Schema::table('contrats', function (Blueprint $table) {
            // Supprimer l'ancienne colonne
            $table->dropColumn('type');
        });

        Schema::table('contrats', function (Blueprint $table) {
            // Renommer la nouvelle colonne
            $table->renameColumn('type_new', 'type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contrats', function (Blueprint $table) {
            $table->dropColumn('type');
            $table->enum('type', ['integration', 'reclassement', 'titularisation', 'avenant signé']);
        });
    }
};
