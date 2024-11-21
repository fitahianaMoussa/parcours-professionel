<?php

namespace App\Notifications;

use App\Models\Agent;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class RetirementNotification extends Notification
{
    use Queueable;

    protected $agent;

    /**
     * Create a new notification instance.
     *
     * @param Agent $agent
     * @return void
     */
    public function __construct(Agent $agent)
    {
        $this->agent = $agent;
    }

    /**
     * Determine which channels the notification should be sent on.
     *
     * @param mixed $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        // Notify via mail, database, and possibly other channels like SMS
        return ['mail', 'database'];
    }

    /**
     * Send the notification through the mail channel.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Retirement Notification')
                    ->greeting('Hello ' . $notifiable->name)
                    ->line('We are notifying you that ' . $this->agent->nom . ' ' . $this->agent->prenom . ' has reached the retirement age and their status has been updated to retired.')
                    ->line('The retirement date is ' . $this->agent->retirement_date->format('d-m-Y'))
                    ->action('View Employee', url('/agents/' . $this->agent->id))
                    ->line('Thank you for managing this employee.');
    }

    /**
     * Send the notification through the database channel.
     *
     * @param mixed $notifiable
     * @return \Illuminate\Notifications\Messages\DatabaseMessage
     */
    public function toDatabase($notifiable)
    {
        return new DatabaseMessage([
            'agent_id' => $this->agent->id,
            'message' => $this->agent->nom . ' ' . $this->agent->prenom . ' has been retired.',
            'retirement_date' => $this->agent->retirement_date,
        ]);
    }

    /**
     * Send the notification through other channels if necessary.
     *
     * @param mixed $notifiable
     * @return void
     */
    public function toSms($notifiable)
    {
        // Example of sending SMS if using a custom SMS service
        // return (new SmsMessage)->content('Retirement Notification: ' . $this->agent->name . ' has retired.');
    }
}
