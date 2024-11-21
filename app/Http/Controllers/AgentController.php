<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAgentRequest;
use App\Http\Requests\UpdateAgentRequest;
use App\Models\Agent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AgentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $agents = Agent::with('categorie')->get();
       // dd($agents);
        return Inertia::render('Agent/AgentIndex',['agents' => $agents]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Agent/AgentCreate');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
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
                'in:diplome,budgetaire'
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
            'indice' => [
                'nullable', 
                'string', 
                'max:50'
            ],
            'is_active' => [
                'boolean'
            ]
        ], [
            'matricule.unique' => 'Ce matricule existe déjà.',
            'date_entree.after' => 'La date d\'entrée doit être postérieure à la date de naissance.',
            'date_de_naissance.before' => 'La date de naissance doit être une date passée.'
        ]);
    
        try {
            $agent = Agent::create($validatedData);
    
            return redirect()
                ->route('agent.index')
                ->with('success', 'Agent créé avec succès');
        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Une erreur s\'est produite lors de la création de l\'agent'])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Agent $agent)
    {
        //
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
