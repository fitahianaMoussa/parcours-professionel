<?php

namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Categorie;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AgentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // Arrays of possible names and surnames
        $firstNames = ['John', 'Alice', 'Robert', 'Emma', 'Michael', 'Sophia', 'James', 'Olivia', 'William', 'Isabella', 'David', 'Mia', 'Richard', 'Charlotte', 'George', 'Amelia', 'Thomas', 'Evelyn', 'Benjamin', 'Harper', 'Jacob', 'Lily', 'Jack', 'Grace', 'Henry', 'Emily', 'Samuel', 'Victoria', 'Daniel', 'Ava'];
        $lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones', 'Miller', 'Davis', 'García', 'Rodriguez', 'Martínez', 'Hernández', 'Lopez', 'González', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'White', 'Harris', 'Clark', 'Lewis', 'Roberts', 'Walker', 'Young', 'Allen'];
        $categories = Categorie::all();
        for ($i = 1; $i <= 30; $i++) {
            // Randomly select a first name and last name
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];

            $agent = Agent::create([
                'nom' => $lastName,
                'prenom' => $firstName,
                'date_entree' => now()->subYears(rand(1, 5))->format('Y-m-d'),
                'categorie_id' => $categories->random()->id,
                'type_recrutement' => collect(['diplome', 'budgetaire'])->random(),
                'diplome' => collect(['Master', 'Licence', 'BTS'])->random(),
                'corps' => collect(['Ingenieur', 'Technicien', 'Analyste'])->random(),
                'chapitre_budgetaire' => 'A' . rand(100, 999),
                'indice' => (string) rand(400, 600),
                'is_active' => true,
            ]);

            User::create([
                'name' => $firstName . ' ' . $lastName, // Full name for user
                'email' => strtolower($firstName . '.' . $lastName . $i . '@example.com'), // Generate unique email based on name
                'password' => bcrypt('password'),
                'role' => 'agent',
                'agent_id' => $agent->id,
            ]);
        }
    }
}
