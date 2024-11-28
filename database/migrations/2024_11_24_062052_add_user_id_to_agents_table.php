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
        Schema::table('agents', function (Blueprint $table) {
            // Add the user_id foreign key column to establish the relationship
            $table->unsignedBigInteger('user_id')->nullable();

            // Add the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agents', function (Blueprint $table) {
            // Drop the foreign key and column when rolling back
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
