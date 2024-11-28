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
        Schema::table('arretes', function (Blueprint $table) {
            // Modify the enum column to add 'STAGE'
            $table->enum('type_arrete', [
                'RECRUTEMENT',
                'INTEGRATION',
                'TITULARISATION',
                'AVANCEMENT',
                'RECLASSEMENT',
                'STAGE' // Added 'STAGE' as a valid value
            ])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('arretes', function (Blueprint $table) {
            $table->enum('type_arrete', [
                'RECRUTEMENT',
                'INTEGRATION',
                'TITULARISATION',
                'AVANCEMENT',
                'RECLASSEMENT'
            ])->change();
        });
    }
};
