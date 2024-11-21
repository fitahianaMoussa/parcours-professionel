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
        
        Schema::table('avancements', function (Blueprint $table) {
            // Définir les phases possibles du contrat
            $table->enum('contract_phase', [
                'integration',
                'stage',
                'titularisation',
                'reclassement',
                'avancement'
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('avancements', function (Blueprint $table) {
            $table->string('contract_phase')->change();
        });
    }
};
