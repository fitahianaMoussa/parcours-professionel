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
        Schema::create('agents', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->date('date_entree');
            $table->unsignedBigInteger('categorie_id')->nullable();
            $table->enum('type_recrutement', ['diplome', 'budgetaire']);
            $table->string('diplome')->nullable();
            $table->string('corps')->nullable(); 
            $table->string('chapitre_budgetaire');
            $table->string('indice')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('categorie_id')->references('id')->on('categories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agents');
    }
};
