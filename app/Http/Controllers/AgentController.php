<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAgentRequest;
use App\Http\Requests\UpdateAgentRequest;
use App\Mail\AgentPasswordMail;
use App\Models\Agent;
use App\Models\Categorie;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;  // Import the Str facade for random string generation
use Inertia\Inertia;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agents = Agent::with('categorie')->get();
        return Inertia::render('Agent/AgentIndex', ['agents' => $agents]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Categorie::all();
        return Inertia::render('Agent/AgentCreate', ['categories' => $categories]);
    }

    /**
     * Store a newly created resource in storage.
     */
  

     public function store(Request $request)
     {
         // Valider les données entrantes
         $validatedData = $request->validate([
             'nom' => 'required|string|max:50',
             'prenom' => 'required|string|max:50',
             'date_de_naissance' => 'nullable|date|before:today',
             'categorie_id' => 'nullable|exists:categories,id',
             'type_recrutement' => 'nullable|in:diplome,budgetaire',
             'diplome' => 'nullable|string|max:255',
             'corps' => 'nullable|string|max:50',
             'chapitre_budgetaire' => 'nullable|string|max:50',
             'is_active' => 'nullable|boolean',
         ]);
     
         // Générer un matricule unique
         $matricule = 'EMP' . strtoupper(Str::random(6));
     
         // Générer une date d'entrée aléatoire
         $dateEntree = now()->subYears(rand(0, 30))->format('Y-m-d');
     
         // Générer un mot de passe sécurisé aléatoire
         $password = 'password';
     
         // Générer un email unique
         $email = strtolower($validatedData['prenom'] . '.' . $validatedData['nom']) . '@example.com';
         $email = $this->generateUniqueEmail($email);
     
         DB::beginTransaction();
         try {
             // Créer l'agent
             $agent = Agent::create([
                 'nom' => $validatedData['nom'],
                 'prenom' => $validatedData['prenom'],
                 'date_entree' => $dateEntree,
                 'categorie_id' => $validatedData['categorie_id'],
                 'type_recrutement' => $validatedData['type_recrutement'] ?? collect(['diplome', 'budgetaire'])->random(),
                 'diplome' => $validatedData['diplome'] ?? collect(['Master', 'Licence', 'BTS'])->random(),
                 'corps' => $validatedData['corps'] ?? collect(['Ingenieur', 'Technicien', 'Analyste'])->random(),
                 'chapitre_budgetaire' => $validatedData['chapitre_budgetaire'] ?? 'A' . rand(100, 999),
                 'is_active' => $validatedData['is_active'] ?? true,
                 'date_de_naissance' => $validatedData['date_de_naissance'] ?? now()->subYears(rand(30, 50))->format('Y-m-d'),
                 'matricule' => $matricule,
             ]);
     
             // Créer l'utilisateur et l'associer à l'agent
             $user = User::create([
                 'name' => $validatedData['prenom'] . ' ' . $validatedData['nom'],
                 'email' => $email,
                 'password' => bcrypt($password),
                 'role' => 'agent',
                 'agent_id' => $agent->id, // Association agent -> user
             ]);
     
             // Mise à jour de l'agent avec l'ID de l'utilisateur
             $agent->user_id = $user->id;
             $agent->save();
     
             DB::commit();
     
             return redirect()->route('agent.index')->with('success', 'Agent créé avec succès.');
     
         } catch (\Exception $e) {
             DB::rollBack();
             return back()->withErrors(['error' => 'Erreur lors de la création de l\'agent : ' . $e->getMessage()]);
         }
     }
     
     /**
      * Générer un email unique pour l'utilisateur.
      *
      * @param string $email
      * @return string
      */
     private function generateUniqueEmail(string $email)
     {
         $originalEmail = $email;
         $counter = 1;
     
         while (User::where('email', $email)->exists()) {
             $email = Str::before($originalEmail, '@') . $counter . '@' . Str::after($originalEmail, '@');
             $counter++;
         }
     
         return $email;
     }
     
    /**
     * Display the specified resource.
     */
    public function show(Agent $agent)
    {
        return Inertia::render('Agent/Detail', [
            'agent' => $agent->getDetailsComplets()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Agent $agent)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAgentRequest $request, Agent $agent)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Agent $agent)
    {
        //
    }
}
