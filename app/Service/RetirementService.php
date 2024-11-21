<?php

namespace App\Service;

use App\Events\RetirementNotificationEvent;
use App\Models\Agent;
use App\Notifications\RetirementNotification;
use Illuminate\Support\Facades\Notification;

class RetirementService
{
    /**
     * Process the retirement of an employee.
     *
     * @param Agent $agent
     * @param bool $isEarlyRetirement
     * @return bool
     * @throws \Exception
     */
    public function processRetirement(Agent $agent, $isEarlyRetirement = false)
    {
        // Validate retirement eligibility
        if (!$this->isEligibleForRetirement($agent, $isEarlyRetirement)) {
            throw new \Exception("Employee not eligible for retirement");
        }

        // Ensure the retirement date is not already set
        if ($agent->status === 'retraite' && $agent->retirement_date) {
            throw new \Exception("This agent is already retired.");
        }

        // Archive employee records
        $this->archiveEmployeeRecords($agent);

        // Send notifications to HR, Finance, Manager, etc.
        $this->sendRetirementNotifications($agent);

        // Update employee status to 'retraite' and set the retirement date
        $this->updateRetirementStatus($agent);

        return true;
    }

    /**
     * Check if the agent is eligible for retirement.
     *
     * @param Agent $agent
     * @param bool $isEarlyRetirement
     * @return bool
     */
    private function isEligibleForRetirement(Agent $agent, $isEarlyRetirement)
    {
        $currentAge = now()->diffInYears($agent->date_de_naissance); // Assuming 'date_de_naissance' is birth_date
        $legalRetirementAge = 65;
        event(new RetirementNotificationEvent($agent));
        return $isEarlyRetirement || $currentAge >= $legalRetirementAge;
    }

    /**
     * Archive employee records when they retire.
     *
     * @param Agent $agent
     */
    private function archiveEmployeeRecords(Agent $agent)
    {
        // Implement archiving logic
        // This could involve creating a RetirementRecord, or moving data to an archive database
    }

    /**
     * Send notifications about the retirement.
     *
     * @param Agent $agent
     */
    private function sendRetirementNotifications(Agent $agent)
    {
        // Send notifications to HR, Finance, Manager, and the employee
        Notification::send(
            [$agent, auth()->user()], // Notify the agent and the current authenticated user (admin/HR)
            new RetirementNotification($agent)
        );
    }

    /**
     * Update the agent's status and retirement date.
     *
     * @param Agent $agent
     */
    private function updateRetirementStatus(Agent $agent)
    {
        // Set status to 'retraite' and update the retirement date
        $agent->status = 'retraite';
        $agent->retirement_date = now(); // Set current date as retirement date
        $agent->save();
    }
}
