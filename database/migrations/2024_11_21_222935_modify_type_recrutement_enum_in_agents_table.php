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
            $table->string('type_recrutement')->change(); // Conversion temporaire en string
        });
    }

    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->enum('type_recrutement', ['diplome', 'budgetaire'])->change(); // Rétablir l'énumération originale
        });
    }
};
