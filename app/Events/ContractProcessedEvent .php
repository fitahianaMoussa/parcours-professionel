<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContractProcessedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $agentId;
    public $status;

    public function __construct(int $agentId, string $status)
    {
        $this->agentId = $agentId;
        $this->status = $status;
    }

    public function broadcastOn()
    {
        return new Channel('contracts');
    }

    public function broadcastAs()
    {
        return 'contract.processed';
    }

    public function broadcastWith()
    {
        return [
            'agent_id' => $this->agentId,
            'status' => $this->status,
            'timestamp' => now()->toISOString()
        ];
    }
}