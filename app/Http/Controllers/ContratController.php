<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContratRequest;
use App\Http\Requests\UpdateContratRequest;
use App\Models\Agent;
use App\Models\Arrete;
use App\Models\Categorie;
use App\Models\Contrat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ContratController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contrats = Contrat::with('arrete','agent')->get();
        return Inertia::render('Contrats/IndexContrat',['contrats' => $contrats]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $agents = Agent::with('categorie')->get()->map(function ($agent) {
            return [
                'id' => $agent->id,
                'nom' => $agent->nom,
                'prenom' => $agent->prenom,
                'categorie' => [
                    'id' => $agent->categorie->id,
                    'niveau' => $agent->categorie->nom,
                ]
            ];
        });
    
        return Inertia::render('Contrats/CreateContrat', [
            'agents' => $agents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
       
            $request->validate([
                'agent_id' => 'required|exists:agents,id',
                'type' => 'required|in:integration,reclassement,titularisation,avenant signé',
                'date_debut' => 'required|date',
                'date_fin' => 'nullable|date|after:date_debut',
                'numero_contrat' => 'required|integer|unique:contrats',
                'status' => 'required|in:terminé,en cours',
                'date_renouvellement' => 'nullable|date|after:date_debut',
                
                // Validation des champs d'arrêté
                'numero_arrete' => 'required|string|unique:arretes',
                'date_arrete' => 'required|date',
                'date_effet' => 'required|date',
                'type_arrete' => 'required|in:RECRUTEMENT,INTEGRATION,TITULARISATION,AVANCEMENT,RECLASSEMENT',
                'objet' => 'required|string',
                'signataire' => 'required|string',
                'reference_anterieure' => 'nullable|string',
                'lieu_signature' => 'required|string',
            ]);
    
            try {
                DB::beginTransaction();
    
                // Création du contrat
                $contrat = Contrat::create([
                    'agent_id' => $request->agent_id,
                    'type' => $request->type,
                    'date_debut' => $request->date_debut,
                    'date_fin' => $request->date_fin,
                    'numero_contrat' => $request->numero_contrat,
                    'status' => $request->status,
                    'is_renouvele' => !empty($request->date_renouvellement),
                    'date_renouvellement' => $request->date_renouvellement,
                    'is_active' => true,
                ]);
                //dd($contrat);
                // Création de l'arrêté associé
                $arrete = Arrete::create([
                    'contrat_id' => $contrat->id,
                    'numero_arrete' => $request->numero_arrete,
                    'date_arrete' => $request->date_arrete,
                    'date_effet' => $request->date_effet,
                    'type_arrete' => $request->type_arrete,
                    'objet' => $request->objet,
                    'signataire' => $request->signataire,
                    'reference_anterieure' => $request->reference_anterieure,
                    'lieu_signature' => $request->lieu_signature,
                ]);
    
                DB::commit();
    
                return redirect()->route('contrat.index')
                    ->with('success', 'Contrat et arrêté créés avec succès');
    
            } catch (\Exception $e) {
                DB::rollback();
                
                return back()->with('error', 'Une erreur est survenue lors de la création du contrat.');
            }
        }
    

    /**
     * Display the specified resource.
     */
    public function show(Contrat $contrat)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contrat $contrat)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContratRequest $request, Contrat $contrat)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contrat $contrat)
    {
        //
    }
}
