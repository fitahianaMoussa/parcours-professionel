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
        Schema::table('contrats', function (Blueprint $table) {
            $table->enum('type', [
                'integration', 
                'reclassement', 
                'titularisation',
                'avenant signé',
                'stage'
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        
        Schema::table('contrats', function (Blueprint $table) {
            $table->enum('type', [
                'integration', 
                'reclassement', 
                'titularisation',
                'avenant signé'
            ])->change();
        });
    }
};
