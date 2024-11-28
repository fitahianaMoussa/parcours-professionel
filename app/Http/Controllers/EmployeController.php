<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Avancement;
use App\Models\Contrat;
use App\Service\ArreteCarrerService;
use App\Service\AvancementCarrerService;
use App\Service\Carrer;
use App\Service\ContratCarrerService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EmployeController extends Controller
{
    protected $careerProgressionService;
    protected $arreteService;
    protected $contratService;
    protected $avancementService;
    
    public function __construct(
        Carrer $careerProgressionService,
        ArreteCarrerService $arreteService,
        ContratCarrerService $contratService,
        AvancementCarrerService $avancementService
    ) {
        $this->careerProgressionService = $careerProgressionService;
        $this->arreteService = $arreteService;
        $this->contratService = $contratService;
        $this->avancementService = $avancementService;
    }
    
    public function EmployeParcours()
    {
        $id = Auth::id();
        //dd($id);
        $agent = Agent::where('user_id', $id)->first();
       // dd($agent);
        $nextProgression = $this->careerProgressionService->calculateNextProgression($agent);
        $careerPaths = $this->careerProgressionService->careerPaths;
        
        return Inertia::render('Employe/CareerManagement/Carrer', [
            'agent' => $agent->load(['contrats', 'avancements','categorie']),
            'progression' => $nextProgression,
            'careerPaths' => $careerPaths
        ]);
    }

    public function Contrats()
    {
        $id = Auth::id();
        $agent = Agent::where('user_id', $id)->first();
        $contrats = Contrat::with('arrete','agent')->where('agent_id',$agent->id)->get();
        return Inertia::render('Employe/Contrat',['contrats' => $contrats]);
    }

    public function Avancements()
    {
        $id = Auth::id();
        $agent = Agent::where('user_id', $id)->first();
        $avancements = Avancement::with('arrete','agent','grade')->where('agent_id',$agent->id)->get();
        return Inertia::render('Employe/Avancement',['avancements' => $avancements]);
    }

    public function showAvancement(Avancement $avancement)
    {
        $avancement->load(['agent', 'grade', 'arrete.contrat']);
        return Inertia::render('Employe/ShowAvancement', [
            'advancement' => $avancement
        ]);
    }
}