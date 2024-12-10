<?php

namespace App\Jobs;

use App\Events\ContractProcessed;
use App\Models\Agent;
use App\Models\Contrat;
use App\Service\ContratService;
use App\Notifications\ContractProcessingNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessContractJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $agent;
    public $timeout = 3600;
    public $tries = 3;

    public function __construct(Agent $agent)
    {
        $this->agent = $agent;
    }

    public function handle(ContratService $contratService)
    {
        try {
            // Envoyer une notification de début de traitement
            $this->agent->notify(new ContractProcessingNotification('started'));

            // Vérifier l'éligibilité à l'avancement
            if ($contratService->checkAdvancementEligibility($this->agent)) {
                $contratService->handleAdvancement($this->agent);
            }

            // Vérifier et traiter le renouvellement des contrats
            $activeContract = $this->agent->contrats()->where('is_active', true)->first();
            if ($activeContract && now()->gte($activeContract->date_fin)) {
                $contratService->handleContractRenewal($activeContract);
            }

            // Vérifier et mettre à jour l'indice salarial
            $contratService->checkAndUpdateSalaryIndex($this->agent);

            // Traiter le parcours de carrière complet
            $contratService->processCompleteCareerPath($this->agent);

            // Diffuser l'événement de traitement réussi
            broadcast(new ContractProcessed($this->agent->id, 'success'));

            // Envoyer une notification de succès
            $this->agent->notify(new ContractProcessingNotification('completed'));

        } catch (\Exception $e) {
            Log::error('Erreur lors du traitement du contrat:', [
                'agent_id' => $this->agent->id,
                'error' => $e->getMessage()
            ]);

            // Diffuser l'événement d'erreur
            broadcast(new ContractProcessed($this->agent->id, 'error'));

            // Envoyer une notification d'erreur
            $this->agent->notify(new ContractProcessingNotification('failed'));

            throw $e;
        }
    }

    public function failed(\Throwable $exception)
    {
        Log::error('Le job de traitement du contrat a échoué:', [
            'agent_id' => $this->agent->id,
            'error' => $exception->getMessage()
        ]);
    }
}