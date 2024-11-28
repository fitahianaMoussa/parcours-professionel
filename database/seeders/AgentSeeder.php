<?php
namespace Database\Seeders;

use App\Models\Agent;
use App\Models\Categorie;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str; 
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

            // Random year between 1940 and the current year for birth date
            $birthYear = rand(1970, 1990); // Random year of birth between 1970 and 1990
            $birthMonth = rand(1, 12); // Random month
            $birthDay = rand(1, 28); // Random day (ensuring valid day for all months)
            $dateDeNaissance = \Carbon\Carbon::create($birthYear, $birthMonth, $birthDay)->format('Y-m-d'); // Format as date

            // Generate unique matricule (employee ID)
            // Add this import at the top of the file

// Replace str_random() with Str::random() in your seeder
$matricule = 'EMP' . strtoupper(Str::random(6)); // Generate a random matricule like EMPXXXXXX
// Generate a random matricule like EMPXXXXXX

            // Create agent record
            $agent = Agent::create([
                'nom' => $lastName,
                'prenom' => $firstName,
                'date_entree' => now()->subYears(rand(0, date('Y') - 1940))->format('Y-m-d'), // Set a random date after 1940
                'categorie_id' => $categories->random()->id,
                'type_recrutement' => collect(['diplome', 'budgetaire'])->random(),
                'diplome' => collect(['Master', 'Licence', 'BTS'])->random(),
                'corps' => collect(['Ingenieur', 'Technicien', 'Analyste'])->random(),
                'chapitre_budgetaire' => 'A' . rand(100, 999),
                'is_active' => true,
                'date_de_naissance' => $dateDeNaissance, // Set date of birth
                'matricule' => $matricule, // Set matricule
            ]);

            // Create user record and associate with the agent
            $user = User::create([
                'name' => $firstName . ' ' . $lastName, // Full name for user
                'email' => strtolower($firstName . '.' . $lastName . $i . '@example.com'), // Generate unique email based on name
                'password' => bcrypt('password'), // Bcrypt password hash
                'role' => 'agent',
                'agent_id' => $agent->id, // Associate with agent
            ]);

            // Add user_id to agent (making sure foreign key is properly set)
            $agent->user_id = $user->id;
            $agent->save();
        }
    }
}
