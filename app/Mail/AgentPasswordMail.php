<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class AgentPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $agentName;
    public $password;

    /**
     * Create a new message instance.
     *
     * @param string $agentName
     * @param string $password
     */
    public function __construct($agentName, $password)
    {
        $this->agentName = $agentName;
        $this->password = $password;
    }

    /**
     * Build the message.
     *
     * @return \Illuminate\Mail\Mailable
     */
    public function build()
    {
        return $this->subject('Your Agent Account Password')
                    ->view('emails.agentPassword'); // This refers to the view you will create in step 2.
    }
}
