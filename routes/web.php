<?php

use App\Events\TestNotificationEvent;
use App\Http\Controllers\AdvancementController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\ArreteController;
use App\Http\Controllers\AvancementController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\CareerManagementController;
use App\Http\Controllers\CareerProcessorController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardStatsController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\EmployeeRetirementController;
use App\Http\Controllers\IntegrationPhaseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReclassementController;
use App\Http\Controllers\ServiceRenduController;
use App\Http\Controllers\TestController;
use App\Models\Avancement;
use App\Models\ServiceRendu;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

Route::middleware(['auth','role:RH'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('agent')->group(function () {
        Route::get('/create', [AgentController::class, 'create'])->name('agent.create');
        Route::get('/', [AgentController::class, 'index'])->name('agent.index');
        Route::get('/{agent}', [AgentController::class, 'show'])->name('agent.show');
        Route::post('/', [AgentController::class, 'store'])->name('agent.store');
    });

    Route::prefix('contrat')->group(function () {
        Route::get('/create', [ContratController::class, 'create'])->name('contrat.create');
        Route::get('/', [ContratController::class, 'index'])->name('contrat.index');
        Route::post('/', [ContratController::class, 'store'])->name('contrat.store');
        Route::get('/{contrat}', [ContratController::class, 'show'])->name('contrat.show');
    });

    Route::prefix('avancement')->group(function () {
        Route::get('/', [AvancementController::class, 'index'])
            ->name('advancements.index');

        Route::post('/evaluate', [AvancementController::class, 'evaluate'])
            ->name('advancements.evaluate');

        Route::post('/', [AvancementController::class, 'store'])
            ->name('avancements.store');

        Route::get('/create', [AvancementController::class, 'create'])
            ->name('advancements.create');
        Route::get('/liste', [AvancementController::class, 'indexListe'])
            ->name('advancements.indexListe');
        Route::get('/{avancement}', [AvancementController::class, 'show'])
            ->name('advancements.show');
    });


    Route::prefix('serviceRendu')->group(function () {
        Route::get('/create', [ServiceRenduController::class, 'create'])->name('service.create');
        Route::get('/', [ServiceRenduController::class, 'index'])->name('service.index');
        Route::post('/', [ServiceRenduController::class, 'store'])->name('service.store');
        Route::get('/releve/{agent}', [ServiceRenduController::class, 'releveService'])->name('service.releve');
        Route::get('/{serviceRendu}', [ServiceRenduController::class, 'show'])
        ->name('service.show');
    });
    Route::get('/integration-phases', [IntegrationPhaseController::class, 'index'])
        ->name('integration-phase.index');

    // Détails d'un agent en phase d'intégration
    Route::get('/integration-phases/{agent}', [IntegrationPhaseController::class, 'show'])
        ->name('integration-phase.show');
        Route::patch('/integration/{agent}', [IntegrationPhaseController::class, 'update'])
        ->name('integration-phase.update');
    // 3: Gestion de la stagiarisation
    Route::get('/integration/{agent}/stagiarisation', [IntegrationPhaseController::class, 'showStagiarisation'])
        ->name('integration-phase.stagiarisation');
    Route::get('/career-management', [CareerManagementController::class, 'index'])->name('career.index');
    Route::get('/career-management/{agent}', [CareerManagementController::class, 'show'])->name('career.show');
    Route::post('/career-management/{agent}/process', [CareerManagementController::class, 'processProgression'])->name('career.process');
    Route::get('/career/{agent}', [CareerController::class, 'dashboard'])->name('career.dashboard');
    // Show employees approaching retirement
    Route::get('/retirement', [EmployeeRetirementController::class, 'index'])->name('retirement.index');

    // Process retirement for a specific employee
    Route::post('/retirement/{employee}', [EmployeeRetirementController::class, 'processRetirement'])->name('employees.retire');

    // Search archived retirees
    Route::get('/archives', [EmployeeRetirementController::class, 'archiveSearch'])->name('archives.index');
    Route::get('/reclassements', [ReclassementController::class, 'index'])->name('reclassements.index');
    Route::get('/reclassements/agents-eligibles', [ReclassementController::class, 'agentsEligibles'])->name('reclassements.agents-eligibles');
    Route::post('/reclassements/{agentId}', [ReclassementController::class, 'reclasser'])->name('reclassements.reclasser');
    Route::get('/reclassements/historique/{agentId?}', [ReclassementController::class, 'historiquesReclassements'])->name('reclassements.historique');

    Route::get('/test-pusher', function () {
        broadcast(new TestNotificationEvent('Pusher fonctionne correctement !'));
        return response()->json(['message' => 'L\'événement a été diffusé.']);
    });

    
// Route pour afficher la page principale de gestion de carrière
Route::get('/careerProcessor/{agentId}', [CareerProcessorController::class, 'index'])
    ->name('caree.index');

// Route pour traiter les données de carrière de l'agent
Route::post('/career/{agentId}/process', [CareerProcessorController::class, 'processCareer'])
    ->name('career.process');

// Route pour récupérer le résumé de carrière (API ou besoin spécifique)
Route::get('/career/{agentId}/summary', [CareerProcessorController::class, 'getCareerSummary'])
    ->name('career.summary');

// Route pour récupérer les avancements formatés de l'agent
Route::get('/career/{agentId}/advancements', [CareerProcessorController::class, 'getFormattedAdvancements'])
    ->name('career.advancements');

// Route pour récupérer les contrats formatés de l'agent
Route::get('/career/{agentId}/contracts', [CareerProcessorController::class, 'getFormattedContracts'])
    ->name('career.contracts');

    Route::get('/contracts/{agentId}', [ContractController::class, 'index'])->name('contracts.index');
    Route::post('/contracts/{agentId}/create-initial', [ContractController::class, 'createInitialContracts'])->name('contracts.create-initial');
    Route::post('/contracts/renew/{contractId}', [ContractController::class, 'renewContract'])->name('contracts.renew');
    Route::post('/agents/{agentId}/advance', [ContractController::class, 'advanceAgent'])->name('agents.advance');
    Route::post('/agents/{agentId}/transition-post-integration', [ContractController::class, 'transitionPostIntegration'])->name('agents.transition-post-integration');
    Route::post('/agents/{agentId}/update-index', [ContractController::class, 'updateSalaryIndex'])->name('agents.update-index');
    Route::post('/agents/{agentId}/reclassify', [ContractController::class, 'reclassifyAgent'])->name('agents.reclassify');
    Route::get('/agents/{agentId}/check-advancement-eligibility', [ContractController::class, 'checkAdvancementEligibility'])->name('agents.check-advancement-eligibility');
    Route::get('/agents/{agentId}/remaining-duration', [ContractController::class, 'getRemainingDuration'])->name('agents.remaining-duration');
    Route::get('/test-career-path/{agentId}', [ContractController::class, 'testCareerPath'])->name('parcours.test');
    Route::put('/arretes/{arrete}', [ArreteController::class, 'update'])->name('arretes.update');
});
Route::middleware(['auth','role:agent'])->group(function () {
    Route::get('/parcours',[EmployeController::class,'EmployeParcours'])->name('employe.parcours');
    Route::get('/employecontrats',[EmployeController::class,'Contrats'])->name('employe.contrats');
    Route::get('/employeavancements',[EmployeController::class,'Avancements'])->name('employe.avancements');
    Route::get('/employeavancements/{avancement}', [EmployeController::class, 'showAvancement']) ->name('advancementsEmploye.show');
});
require __DIR__ . '/auth.php';
