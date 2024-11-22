<?php

namespace App\Console;

use App\Console\Commands\ProcessCareerProgressionCommand;
use App\Jobs\DetectAndNotifyRetirementJob;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
      /**
     * Les commandes Artisan enregistrées par l'application.
     *
     * @var array
     */
    protected $commands = [
        ProcessCareerProgressionCommand::class,  // Ajouter votre commande personnalisée ici
    ];
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
       // $schedule->command('avancement:process')->daily();
        // Exécution quotidienne d'une commande, par exemple
        $schedule->command('career:process')->daily();
        $schedule->job(new DetectAndNotifyRetirementJob())->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
