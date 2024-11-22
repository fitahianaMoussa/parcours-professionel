<?php

namespace App\Jobs;

use App\Models\Agent;
use App\Notifications\RetirementNotification;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class DetectAndNotifyRetirementJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct()
    {
        //
    }

    public function handle()
    {
        // Récupérer les agents approchant la retraite
        $agents = Agent::approachingRetirement(0)
            ->where('status', '!=', 'retraite')
            ->get();

        foreach ($agents as $agent) {
            // Mettre à jour l'agent en retraite
            $agent->initiateRetirement();

            // Envoyer une notification
           // $agent->notify(new RetirementNotification($agent));
        }
    }
}
