<?php

namespace App\Http\Controllers;

use App\Models\ServiceRendu;
use App\Models\Reclassement;
use App\Models\Contrat;
use App\Models\Avancement;
use App\Models\Agent;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Index', [
            'stats' => [
                'services' => $this->getServiceStats(),
                'reclassements' => $this->getReclassementStats(),
                'contrats' => $this->getContratStats(),
                'avancements' => $this->getAvancementStats(),
                'agents' => $this->getAgentStats(),
            ]
        ]);
    }

    private function getServiceStats(): array
    {
        $averageDuration = ServiceRendu::all()->avg(function ($service) {
            return Carbon::parse($service->date_debut)->diffInMonths($service->date_fin);
        });

        $servicesByAgent = ServiceRendu::select('agent_id', DB::raw('count(*) as total'))
            ->with('agent:id,nom,prenom')
            ->groupBy('agent_id')
            ->get()
            ->map(function ($service) {
                return [
                    'agent' => $service->agent->nom . ' ' . $service->agent->prenom,
                    'total' => $service->total
                ];
            });

        return [
            'averageDuration' => round($averageDuration, 1),
            'servicesByAgent' => $servicesByAgent
        ];
    }

    private function getReclassementStats(): array
    {
        $successfulReclassments = Reclassement::whereNotNull('nouvelle_categorie_id')->count();
        $totalReclassments = Reclassement::count();
        $successRate = $totalReclassments > 0 ? ($successfulReclassments / $totalReclassments) * 100 : 0;

        $reclassmentsByCategory = Reclassement::select('ancienne_categorie_id', DB::raw('count(*) as total'))
            ->with('ancienneCategorie:id,name')
            ->groupBy('ancienne_categorie_id')
            ->get()
            ->map(function ($reclassement) {
                return [
                    'category' => $reclassement->ancienneCategorie->name,
                    'total' => $reclassement->total
                ];
            });

        return [
            'successRate' => round($successRate, 1),
            'reclassmentsByCategory' => $reclassmentsByCategory
        ];
    }

    private function getContratStats(): array
    {
        $totalContracts = Contrat::count();
        $renewedContracts = Contrat::whereNotNull('date_renouvellement')->count();
        $renewalRate = $totalContracts > 0 ? ($renewedContracts / $totalContracts) * 100 : 0;

        $contractsExpiring3Months = Contrat::where('date_fin', '<=', Carbon::now()->addMonths(3))
            ->where('date_fin', '>=', Carbon::now())
            ->count();

        $contractsExpiring6Months = Contrat::where('date_fin', '<=', Carbon::now()->addMonths(6))
            ->where('date_fin', '>=', Carbon::now())
            ->count();

        return [
            'renewalRate' => round($renewalRate, 1),
            'expiringIn3Months' => $contractsExpiring3Months,
            'expiringIn6Months' => $contractsExpiring6Months
        ];
    }

    private function getAvancementStats(): array
    {
        $averageDuration = Avancement::all()->avg(function ($avancement) {
            return Carbon::parse($avancement->date_debut)->diffInMonths($avancement->date_fin);
        });

        $advancementsByGrade = Avancement::select('grade_id', DB::raw('count(*) as total'))
            ->with('grade:id,grade,echelon')
            ->groupBy('grade_id')
            ->get()
            ->map(function ($advancement) {
                return [
                    'grade' => $advancement->grade->name,
                    'total' => $advancement->total
                ];
            });

        return [
            'averageDuration' => round($averageDuration, 1),
            'advancementsByGrade' => $advancementsByGrade
        ];
    }

    private function getAgentStats(): array
    {
        $activeAgents = Agent::where('status', 'actif')->count();
        $retiredAgents = Agent::where('status', 'retraite')->count();
        $approachingRetirement = Agent::approachingRetirement()->count();

        $agentsByCategory = Agent::select('categorie_id', DB::raw('count(*) as total'))
            ->with('categorie:id,nom')
            ->groupBy('categorie_id')
            ->get()
            ->map(function ($category) {
                return [
                    'category' => $category->categorie->name,
                    'total' => $category->total
                ];
            });

        return [
            'activeAgents' => $activeAgents,
            'retiredAgents' => $retiredAgents,
            'approachingRetirement' => $approachingRetirement,
            'agentsByCategory' => $agentsByCategory
        ];
    }
}