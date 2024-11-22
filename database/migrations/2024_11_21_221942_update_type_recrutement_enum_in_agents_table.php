<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            // Convertir temporairement la colonne en string
            $table->string('type_recrutement')->change();
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            // Restaurer l'ancien ENUM si nécessaire
            $table->enum('type_recrutement', ['diplome', 'budgetaire'])->change();
        });
    }
};
