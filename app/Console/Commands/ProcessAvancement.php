<?php
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Agent;
use App\Service\AvancementService as ServiceAvancementService;

class ProcessAvancement extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'avancement:process';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process and update the avancement of agents';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle(ServiceAvancementService $avancementService)
    {
        // Fetch all agents and process their avancement
        $agents = Agent::all();
        foreach ($agents as $agent) {
            $avancementService->avancerAgent($agent);
        }
       // $this->info('Avancement processing completed.');
    }
}
