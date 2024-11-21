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
        Schema::create('arretes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contrat_id')->constrained('contrats');
            $table->string('numero_arrete');
            $table->date('date_arrete');
            $table->date('date_effet');
            $table->enum('type_arrete', [
                'RECRUTEMENT',
                'INTEGRATION',
                'TITULARISATION',
                'AVANCEMENT',
                'RECLASSEMENT'
            ]);
            $table->text('objet');
            $table->string('signataire');
            $table->text('reference_anterieure')->nullable(); // Référence à l'arrêté précédent
            $table->string('lieu_signature')->default('Fianarantsoa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('arretes');
    }
};
