<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class ContractProcessingNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private $status;

    public function __construct(string $status)
    {
        $this->status = $status;
    }

    public function via($notifiable): array
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'status' => $this->status,
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'agent_id' => $notifiable->id
        ];
    }

    public function toBroadcast($notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'status' => $this->status,
            'title' => $this->getTitle(),
            'message' => $this->getMessage(),
            'agent_id' => $notifiable->id
        ]);
    }

    private function getTitle(): string
    {
        return match($this->status) {
            'started' => 'Traitement du contrat démarré',
            'completed' => 'Traitement du contrat terminé',
            'failed' => 'Erreur de traitement du contrat',
            default => 'Mise à jour du contrat'
        };
    }

    private function getMessage(): string
    {
        return match($this->status) {
            'started' => 'Le traitement de votre contrat a commencé',
            'completed' => 'Le traitement de votre contrat est terminé avec succès',
            'failed' => 'Une erreur est survenue lors du traitement de votre contrat',
            default => 'Votre contrat est en cours de mise à jour'
        };
    }
}