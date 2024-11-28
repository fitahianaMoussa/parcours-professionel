<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAgentRequest;
use App\Http\Requests\UpdateAgentRequest;
use App\Mail\AgentPasswordMail;
use App\Models\Agent;
use App\Models\Categorie;
use App\Models\User;
use Illuminate\Http\Request;
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
        // Validate incoming request data
        $validatedData = $request->validate([
            'matricule' => [
                'required',
                'string',
                'max:50',
                'unique:agents,matricule'
            ],
            'nom' => [
                'required',
                'string',
                'max:100'
            ],
            'prenom' => [
                'required',
                'string',
                'max:100'
            ],
            'date_de_naissance' => [
                'nullable',
                'date',
                'before:today'
            ],
            'date_entree' => [
                'required',
                'date',
                'after:date_de_naissance'
            ],
            'categorie_id' => [
                'nullable',
                'exists:categories,id'
            ],
            'type_recrutement' => [
                'nullable',
                'in:Diplôme,Poste budgétaire libre'
            ],
            'diplome' => [
                'nullable',
                'string',
                'max:255'
            ],
            'corps' => [
                'nullable',
                'string',
                'max:100'
            ],
            'chapitre_budgetaire' => [
                'nullable',
                'string',
                'max:100'
            ],
            'is_active' => [
                'boolean'
            ]
        ], [
            'matricule.unique' => 'Ce matricule existe déjà.',
            'date_entree.after' => 'La date d\'entrée doit être postérieure à la date de naissance.',
            'date_de_naissance.before' => 'La date de naissance doit être une date passée.'
        ]);

        // Generate a random password for the user
        $password = Str::random(8);  // Adjust the length of the password as needed

        try {
            // Create the user and hash the password
            $user = User::create([
                'name' => $validatedData['nom'] . ' ' . $validatedData['prenom'], 
                'email' => $validatedData['nom'] . '@regionhautematsiatra.com', 
                'password' => Hash::make($password),  
                'role' => 'agent', 
            ]);

            // Now, create the agent and associate it with the user
            $agent = Agent::create(array_merge($validatedData, [
                'user_id' => $user->id,  // Associate the agent with the user
            ]));

            // Optionally, you can send the password to the user via email or display it
            // Example: Send an email with the password to the user
           // Mail::to($user->email)->send(new AgentPasswordMail($user->name, $password));
            return redirect()
                ->route('agent.index')
                ->with('success', 'Agent créé avec succès. Mot de passe : ' . $password);
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Une erreur s\'est produite lors de la création de l\'agent : ' . $e->getMessage()])
                ->withInput();
        }
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
