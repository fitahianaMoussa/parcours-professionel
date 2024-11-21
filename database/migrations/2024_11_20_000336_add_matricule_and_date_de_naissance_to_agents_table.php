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
        // Check if 'matricule' column does not exist before adding it
        if (!Schema::hasColumn('agents', 'matricule')) {
            Schema::table('agents', function (Blueprint $table) {
                $table->string('matricule')->nullable()->after('id'); // Added without unique constraint
                $table->date('date_de_naissance')->nullable()->after('prenom');
            });
        }

        // Ensure that 'matricule' values are unique by updating any NULL or empty values
        DB::table('agents')->whereNull('matricule')->orWhere('matricule', '')->update([
            'matricule' => DB::raw('UUID()') // Use UUID or any other strategy to ensure uniqueness
        ]);

        // Add the unique constraint to 'matricule'
        Schema::table('agents', function (Blueprint $table) {
            $table->unique('matricule');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            $table->dropColumn(['matricule', 'date_de_naissance']);
        });
    }
};
