<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Avancement;
use App\Models\Grade;
use App\Models\Arrete;
use App\Models\Contrat;
use App\Service\AvancementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AvancementController extends Controller
{
    protected $advancementService;

    public function __construct(AvancementService $advancementService)
    {
        $this->advancementService = $advancementService;
    }

    /**
     * Display eligible agents for advancement
     */
    public function index()
    {
        $eligibleAgents = $this->advancementService->findEligibleAgents();
        
        return Inertia::render('Avancement/Index', [
            'eligibleAgents' => $eligibleAgents
        ]);
    }

    /**
     * Evaluate and process advancement for specific agents
     */
    public function evaluate(Request $request)
    {
        $validatedData = $request->validate([
            'agents' => 'required|array',
            'agents.*.id' => 'exists:agents,id',
            'agents.*.approved' => 'boolean'
        ]);

        $results = $this->advancementService->processAdvancements($validatedData['agents']);

        return back()->with('success', 'Advancements processed successfully');
    }

    public function indexListe()
    {
        $avancements = Avancement::with(['agent', 'grade', 'arrete'])->get();
       // dd($avancements);
        return Inertia::render('Avancement/Liste', [
            'avancements' => $avancements
        ]);
    }

    public function create()
    {
        return Inertia::render('Avancement/AvancementCreate', [
            'agents' => Agent::where('is_active', true)->get(),
            'grades' => Grade::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            // Validation des champs d'avancement
            'agent_id' => 'required|exists:agents,id',
            'grade_id' => 'required|exists:grades,id',
            'duree_mois' => 'required|integer|min:1',
            'date_debut' => 'required|date',
            'date_effet' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'echelon' => 'required|integer|min:1',
            
            // Validation des champs d'arrêté
            'numero_arrete' => 'required|string|unique:arretes,numero_arrete',
            'date_arrete' => 'required|date',
            'type_arrete' => 'required|string',
            'objet' => 'required|string',
            'signataire' => 'required|string',
            
            // Validation des champs de contrat
            'type_contrat' => 'required|string',
            'numero_contrat' => 'required|integer|unique:contrats,numero_contrat',
            'contrat_status' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            
            // Création du contrat
            $contrat = Contrat::create([
                'agent_id' => $request->agent_id,
                'type' => $request->type_contrat,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'numero_contrat' => $request->numero_contrat,
                'status' => $request->contrat_status,
                'is_renouvele' => $request->is_renouvele,
                'date_renouvellement' => $request->date_renouvellement,
            ]);

            // Création de l'arrêté
            $arrete = Arrete::create([
                'contrat_id' => $contrat->id,
                'numero_arrete' => $request->numero_arrete,
                'date_arrete' => $request->date_arrete,
                'date_effet' => $request->date_effet,
                'type_arrete' => $request->type_arrete,
                'objet' => $request->objet,
                'signataire' => $request->signataire,
                'reference_anterieure' => $request->reference_anterieure,
                'lieu_signature' => $request->lieu_signature ?? 'Fianarantsoa',
            ]);

            // Création de l'avancement
            $avancement = Avancement::create([
                'agent_id' => $request->agent_id,
                'grade_id' => $request->grade_id,
                'arrete_id' => $arrete->id,
                'duree_mois' => $request->duree_mois,
                'date_debut' => $request->date_debut,
                'date_effet' => $request->date_effet,
                'date_fin' => $request->date_fin,
                'is_integration' => $request->is_integration,
                'echelon' => $request->echelon,
                'contract_phase' => $request->contract_phase ?? 1,
                'status' => $request->status ?? 'integrated',
                'index_value' => $request->index_value ?? 0,
                'contract_renewal_date' => $request->contract_renewal_date,
            ]);

            DB::commit();

            return redirect()->route('advancements.indexListe')
                ->with('success', 'Avancement créé avec succès.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Une erreur est survenue lors de la création de l\'avancement.');
        }
    }

    public function show(Avancement $avancement)
    {
        $avancement->load(['agent', 'grade', 'arrete.contrat']);
        //dd( $avancement->load(['agent', 'grade', 'arrete.contrat']));
        return Inertia::render('Avancement/Show', [
            'advancement' => $avancement
        ]);
    }

    public function edit(Avancement $avancement)
    {
        $avancement->load(['agent', 'grade', 'arrete.contrat']);
        
        return Inertia::render('Avancements/Edit', [
            'avancement' => $avancement,
            'agents' => Agent::where('is_active', true)->get(),
            'grades' => Grade::all()
        ]);
    }

    public function update(Request $request, Avancement $avancement)
    {
        $request->validate([
            // Mêmes règles de validation que pour store()
            'agent_id' => 'required|exists:agents,id',
            'grade_id' => 'required|exists:grades,id',
            'duree_mois' => 'required|integer|min:1',
            'date_debut' => 'required|date',
            'date_effet' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'echelon' => 'required|integer|min:1',
            
            'numero_arrete' => 'required|string|unique:arretes,numero_arrete,' . $avancement->arrete_id,
            'date_arrete' => 'required|date',
            'type_arrete' => 'required|string',
            'objet' => 'required|string',
            'signataire' => 'required|string',
            
            'type_contrat' => 'required|string',
            'numero_contrat' => 'required|integer|unique:contrats,numero_contrat,' . $avancement->arrete->contrat_id,
            'contrat_status' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Mise à jour du contrat
            $avancement->arrete->contrat->update([
                'type' => $request->type_contrat,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'numero_contrat' => $request->numero_contrat,
                'status' => $request->contrat_status,
                'is_renouvele' => $request->is_renouvele,
                'date_renouvellement' => $request->date_renouvellement,
            ]);

            // Mise à jour de l'arrêté
            $avancement->arrete->update([
                'numero_arrete' => $request->numero_arrete,
                'date_arrete' => $request->date_arrete,
                'date_effet' => $request->date_effet,
                'type_arrete' => $request->type_arrete,
                'objet' => $request->objet,
                'signataire' => $request->signataire,
                'reference_anterieure' => $request->reference_anterieure,
                'lieu_signature' => $request->lieu_signature ?? 'Fianarantsoa',
            ]);

            // Mise à jour de l'avancement
            $avancement->update([
                'agent_id' => $request->agent_id,
                'grade_id' => $request->grade_id,
                'duree_mois' => $request->duree_mois,
                'date_debut' => $request->date_debut,
                'date_effet' => $request->date_effet,
                'date_fin' => $request->date_fin,
                'is_integration' => $request->is_integration,
                'echelon' => $request->echelon,
                'contract_phase' => $request->contract_phase ?? 1,
                'status' => $request->status ?? 'integrated',
                'index_value' => $request->index_value ?? 0,
                'contract_renewal_date' => $request->contract_renewal_date,
            ]);

            DB::commit();

            return redirect()->route('avancements.index')
                ->with('success', 'Avancement mis à jour avec succès.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Une erreur est survenue lors de la mise à jour de l\'avancement.');
        }
    }

    public function destroy(Avancement $avancement)
    {
        try {
            DB::beginTransaction();

            // Suppression en cascade (l'arrêté et le contrat seront supprimés automatiquement si configuré dans les migrations)
            $avancement->delete();

            DB::commit();

            return redirect()->route('avancements.index')
                ->with('success', 'Avancement supprimé avec succès.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->with('error', 'Une erreur est survenue lors de la suppression de l\'avancement.');
        }
    }
}