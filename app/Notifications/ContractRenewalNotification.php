<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Contrat;

class ContractRenewalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $contract;

    public function __construct(Contrat $contract)
    {
        $this->contract = $contract;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toArray($notifiable)
    {
        return [
            'message' => "Renouvellement du contrat pour {$this->contract->agent->nom_complet}",
            'contract_id' => $this->contract->id,
            'agent_id' => $this->contract->agent_id,
            'type' => 'contract_renewed'
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'message' => "Renouvellement du contrat pour {$this->contract->agent->nom_complet}",
            'contract_id' => $this->contract->id,
            'agent_id' => $this->contract->agent_id,
            'type' => 'contract_renewed'
        ]);
    }
}
