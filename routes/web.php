<?php

use App\Http\Controllers\AdvancementController;
use App\Http\Controllers\AgentController;
use App\Http\Controllers\AvancementController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\CareerManagementController;
use App\Http\Controllers\ContratController;
use App\Http\Controllers\EmployeeRetirementController;
use App\Http\Controllers\IntegrationPhaseController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceRenduController;
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

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('agent')->group(function () {
        Route::get('/create', [AgentController::class, 'create'])->name('agent.create');
        Route::get('/', [AgentController::class, 'index'])->name('agent.index');
        Route::post('/', [AgentController::class, 'store'])->name('agent.store');
    });

    Route::prefix('contrat')->group(function () {
        Route::get('/create', [ContratController::class, 'create'])->name('contrat.create');
        Route::get('/', [ContratController::class, 'index'])->name('contrat.index');
        Route::post('/', [ContratController::class, 'store'])->name('contrat.store');
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
    });
    Route::get('/integration-phases', [IntegrationPhaseController::class, 'index'])
        ->name('integration-phase.index');

    // Détails d'un agent en phase d'intégration
    Route::get('/integration-phases/{agent}', [IntegrationPhaseController::class, 'show'])
        ->name('integration-phase.show');
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
});

require __DIR__ . '/auth.php';
