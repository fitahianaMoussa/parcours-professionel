<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use Inertia\Inertia;
use App\Models\Employee;
use App\Service\RetirementService;
use Illuminate\Http\Request;

class EmployeeRetirementController extends Controller
{
    protected $retirementService;

    public function __construct(RetirementService $retirementService)
    {
        $this->retirementService = $retirementService;
    }

    public function index()
    {
        $employees = Agent::query()
            ->where('status', '!=', 'retraite')
            ->where(fn($query) => $query->isApproachingRetirement())
            ->paginate(10);

        return Inertia::render('Retirement/Index', [
            'employees' => $employees
        ]);
    }

    public function processRetirement(Request $request, Agent $employee)
    {
        $validated = $request->validate([
            'is_early_retirement' => 'boolean'
        ]);

        try {
            $this->retirementService->processRetirement(
                $employee, 
                $validated['is_early_retirement'] ?? false
            );

            return back()->with('success', 'Retirement processed successfully');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function archiveSearch(Request $request)
    {
        $query = Agent::query()->where('status', 'retraite');

        if ($request->filled('search')) {
            $query->where(fn($q) => 
                $q->where('nom', 'LIKE', "%{$request->search}%")
                  ->orWhere('prenom', 'LIKE', "%{$request->search}%")
            );
        }

        $archives = $query->paginate(10);

        return Inertia::render('Archive/Index', [
            'archives' => $archives
        ]);
    }
}