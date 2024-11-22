<?php

namespace App\Service;

use App\Models\Agent;
use App\Models\Reclassement;
use App\Models\Categorie;
use Carbon\Carbon;
use Exception;

class ReclassementService
{
    /**
     * Vérifie si un agent est éligible au reclassement
     */
    public function verifierEligibilite(Agent $agent): bool
    {
        return $agent->peutEtreReclasse();
    }

    /**
     * Réalise le reclassement d'un agent
     */
    public function reclasserAgent(Agent $agent, Categorie $nouvelleCategorie): Reclassement
    {
        if (!$this->verifierEligibilite($agent)) {
            throw new Exception("L'agent n'est pas éligible au reclassement.");
        }

        $reclassement = Reclassement::create([
            'agent_id' => $agent->id,
            'ancienne_categorie_id' => $agent->categorie_id,
            'nouvelle_categorie_id' => $nouvelleCategorie->id,
            'date_reclassement' => now(),
        ]);

        // Mise à jour de l'agent
        $agent->categorie_id = $nouvelleCategorie->id;
        $agent->save();

        return $reclassement;
    }

    /**
     * Recherche des agents éligibles au reclassement
     */
    public function obtenirAgentsEligibles()
    {
        return Agent::where('is_active', true)
            ->where('status', '!=', 'retraite')
            ->where(function ($query) {
                $query->whereHas('contrats', function ($contratQuery) {
                    $contratQuery->whereYear('date_fin', Carbon::now()->year - 1);
                })->orWhere(function ($query) {
                    $query->where('date_entree', '>=', now()->subYears(6));
                });
            })
            ->get();
    }
}
