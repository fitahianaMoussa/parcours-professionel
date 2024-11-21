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
        Schema::create('avancements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agent_id')->constrained('agents');
            $table->foreignId('grade_id')->constrained('grades');
            $table->foreignId('arrete_id')->constrained('arretes');
            $table->integer('duree_mois'); 
            $table->date('date_debut');
            $table->date('date_effet');
            $table->date('date_fin');
            $table->boolean('is_integration')->default(false);
            $table->integer('echelon')->default(1);        
            $table->integer('contract_phase')->default(1);  
            $table->string('status')->default('integrated'); 
            $table->integer('index_value')->default(0);     
            $table->date('contract_renewal_date')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('avancements');
    }
};
