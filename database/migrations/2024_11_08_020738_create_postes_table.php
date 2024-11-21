<?php

use Illuminate\Database\Migrations\Migration;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Schema::create('postes', function (Blueprint $table) {
        //     $table->id();
        //     Schema::create('postes', function (Blueprint $table) {
        //         $table->id();
        //         $table->string('intitule');          // Ex: Chef de Service, Directeur, etc.
        //         $table->boolean('is_active')->default(true);
        //         $table->timestamps();
        //     });
        //     $table->timestamps();
        // });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      //  Schema::dropIfExists('postes');
    }
};
