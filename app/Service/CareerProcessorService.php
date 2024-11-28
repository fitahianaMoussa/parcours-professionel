<?php

namespace App\Service;

use App\Models\Agent;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CareerProcessorService
{
    private ContratService $contratService;

    public function __construct(ContratService $contratService)
    {
        $this->contratService = $contratService;
    }

    /**
     * Traiter automatiquement le parcours complet d'un agent
     */
    public function processFullCareer(Agent $agent): void
    {
        try {
            DB::beginTransaction();

            // 1. Phase initiale (2001-2007) : 3 contrats de 2 ans chacun
           $this->processInitialContracts($agent);

            // 2. Phase post-intégration (2007 et après)
            $this->processPostIntegration($agent);

            // 3. Phase avancements successifs jusqu'à aujourd'hui
            $this->processSuccessiveAdvancements($agent);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Traiter les contrats initiaux (6 premières années)
     */
    private function processInitialContracts(Agent $agent): void
    {
        // Création des 3 contrats initiaux (2001-2007)
        $this->contratService->createInitialContracts($agent);

        // Simuler le passage automatique des 3 contrats
        $contrats = $agent->contrats()->orderBy('numero_contrat')->get();
        
        foreach ($contrats as $contrat) {
            // On attend que la date de fin du contrat soit atteinte
            $dateFin = Carbon::parse($contrat->date_fin);
            
            if ($dateFin->lt(Carbon::now())) {
                $this->contratService->handleContractRenewal($contrat);
            }
        }
    }

    /**
     * Traiter la phase post-intégration
     */
    private function processPostIntegration(Agent $agent): void
    {
        // Phase post-intégration commence en 2007
        $datePostIntegration = Carbon::parse('2007-01-01');
        
        if (Carbon::now()->gt($datePostIntegration)) {
            $this->contratService->handlePostIntegrationPhase($agent);
        }
    }

    /**
     * Traiter les avancements successifs jusqu'à aujourd'hui
     */
    private function processSuccessiveAdvancements(Agent $agent): void
    {
        $currentDate = Carbon::now();
        $processingDate = Carbon::parse('2007-01-01'); // Début des avancements après intégration

        while ($processingDate->lt($currentDate)) {
            if ($this->contratService->checkAdvancementEligibility($agent)) {
                $this->contratService->handleAdvancement($agent);
            }

            // Vérifier et mettre à jour l'indice salarial si nécessaire
            $this->contratService->checkAndUpdateSalaryIndex($agent);

            // Avancer de 2 ans (durée standard entre les avancements)
            $processingDate->addYears(2);
        }
    }

    /**
     * Obtenir un résumé du parcours
     */
    public function getCareerSummary(Agent $agent): array
    {
        return [
            'debut_carriere' => $agent->date_entree,
            'annees_service' => Carbon::parse($agent->date_entree)->diffInYears(Carbon::now()),
            'contrats' => $agent->contrats()->count(),
            'avancements' => $agent->avancements()->count(),
            'grade_actuel' => $agent->avancements()->latest()->first()?->grade,
            'indice_actuel' => $agent->indice,
            'status_actuel' => $agent->status
        ];
    }
}