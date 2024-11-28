<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Agent;

class ContractCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $agent;

    public function __construct(Agent $agent)
    {
        $this->agent = $agent;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Nouveaux contrats créés pour {$this->agent->nom_complet}",
            'agent_id' => $this->agent->id,
            'type' => 'contract_created'
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "Nouveaux contrats créés pour {$this->agent->nom_complet}",
            'agent_id' => $this->agent->id,
            'type' => 'contract_created'
        ]);
    }
}
