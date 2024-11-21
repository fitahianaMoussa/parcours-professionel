<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreServiceRenduRequest;
use App\Http\Requests\UpdateServiceRenduRequest;
use App\Models\Agent;
use App\Models\Avancement;
use App\Models\ReferencesReglementaire;
use App\Models\ServiceRendu;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceRenduController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $services = ServiceRendu::with('reference','agent')->get();
       // dd($services);
        return Inertia::render('ServiceRendu/IndexServiceRendu',['services' => $services]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $agents = Agent::all();
        return Inertia::render('ServiceRendu/CreateServiceRendu',['agents' => $agents]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'poste_occupe' => 'required|string',
            'lieu' => 'required|string',
            'agent_id' => 'required|integer',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date',
            'reference.numero' => 'required|string',
            'reference.date_reference' => 'required|date',
            'reference.objet' => 'nullable|string',
            'reference.type' => 'required|in:ACTE NOMINATION,ARRETE,DECISION,NOTE DE SERVICE,CONTRAT DE TRAVAIL',
            'status' => 'required|in:active,completed,pending',
        ]);

       // dd($validated);

        // Créer la référence réglementaire
        $reference = ReferencesReglementaire::create($validated['reference']);

        // Créer le service rendu avec la référence associée
        $serviceRendu = ServiceRendu::create([
            'poste_occupe' => $validated['poste_occupe'],
            'lieu' => $validated['lieu'],
            'date_debut' => $validated['date_debut'],
            'date_fin' => $validated['date_fin'],
            'reference_id' => $reference->id,
            'status' => $validated['status'],
            'agent_id' => $validated['agent_id'],
        ]);


        return redirect()->route('service.index');

    }

    /**
     * Display the specified resource.
     */
    public function show(ServiceRendu $serviceRendu)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ServiceRendu $serviceRendu)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateServiceRenduRequest $request, ServiceRendu $serviceRendu)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ServiceRendu $serviceRendu)
    {
        //
    }


    public function releveService(Agent $agent)
    {
        // Charger les avancements de l'agent donné
    $avancements = Avancement::with(['grade', 'arrete','agent'])
    ->where('agent_id', $agent->id)
    ->get();
    $services = ServiceRendu::with(['reference', 'agent'])
    ->where('agent_id', $agent->id)
    ->get();

        return Inertia::render('ServiceRendu/Releve',[
            'avancements' => $avancements,
            'services' => $services,
            'agent' => $agent
        ]);
    }
}
