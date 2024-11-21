<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Service\Carrer;
use App\Models\Agent;
use App\Models\Contrat;
use App\Models\Avancement;
use Carbon\Carbon;

class CarrerTest extends TestCase
{
    protected $carrerService;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->carrerService = new Carrer();
    }

    /**
     * Test initial integration phase calculation
     */
    public function testInitialIntegrationPhase()
    {
        // Test Category III integration
        $agent = $this->createMockAgent('CATEGORY_III');
        $progression = $this->carrerService->calculateNextProgression($agent);
        
        $this->assertEquals('INTEGRATION', $progression['type']);
        $this->assertEquals(1, $progression['phase']);
        $this->assertEquals(24, $progression['duration']);
    }

    /**
     * Test Category IV+ specific rules
     */
    public function testCategoryIVPlusIntegration()
    {
        $agent = $this->createMockAgent('CATEGORY_IV_PLUS');
        $contract = $this->createMockContract($agent, 'integration', 1);
        
        $progression = $this->carrerService->handleIntegrationProgression($agent, $contract);
        
        $this->assertEquals('2eme_classe', $progression['grade']);
        $this->assertEquals(1, $progression['echelon']);
    }

    /**
     * Test retirement calculation edge cases
     */
    public function testRetirementCalculation()
    {
        // Test approaching retirement
        $agent = $this->createMockAgent('CATEGORY_III', '1964-01-01');
        $retirement = $this->carrerService->calculateTimeToRetirement($agent);
        
        $this->assertTrue($retirement['is_retired']);
        
        // Test early career
        $agent = $this->createMockAgent('CATEGORY_III', '1990-01-01');
        $retirement = $this->carrerService->calculateTimeToRetirement($agent);
        
        $this->assertFalse($retirement['is_retired']);
        $this->assertGreaterThan(20, $retirement['years_remaining']);
    }

    /**
     * Test grade progression rules
     */
    public function testGradeProgression()
    {
        $testCases = [
            ['2eme_classe', 1, '2eme_classe', 2],
            ['2eme_classe', 3, '1ere_classe', 1],
            ['1ere_classe', 3, 'principal', 1],
            ['principal', 3, 'exceptionnel', 1],
        ];

        foreach ($testCases as [$currentGrade, $currentEchelon, $expectedGrade, $expectedEchelon]) {
            $result = $this->carrerService->determineNextGradeAndEchelon($currentGrade, $currentEchelon);
            
            $this->assertEquals($expectedGrade, $result['grade']);
            $this->assertEquals($expectedEchelon, $result['echelon']);
        }
    }

    /**
     * Test special case: Poste Budgetaire
     */
    public function testPosteBudgetaireProgression()
    {
        $agent = $this->createMockAgent('POSTE_BUDGETAIRE');
        $contract = $this->createMockContract($agent, 'integration', 1);
        
        $progression = $this->carrerService->handleIntegrationProgression($agent, $contract);
        
        $this->assertTrue(
            isset($progression['details']['contract_type']),
            'Poste Budgetaire should include contract type details'
        );
    }

    /**
     * Test validation of career path constraints
     */
    public function testCareerPathValidation()
    {
        $agent = $this->createMockAgent('CATEGORY_III');
        $projection = $this->carrerService->generateCareerProjection($agent);
        
        // Validate sequential progression
        $this->validateSequentialProgression($projection);
        
        // Validate duration constraints
        $this->validateDurationConstraints($projection);
    }

    private function validateSequentialProgression($projection)
    {
        $grades = ['2eme_classe', '1ere_classe', 'principal', 'exceptionnel'];
        $currentGradeIndex = 0;
        
        foreach ($projection as $step) {
            if (isset($step['grade'])) {
                $stepGradeIndex = array_search($step['grade'], $grades);
                $this->assertGreaterThanOrEqual(
                    $currentGradeIndex,
                    $stepGradeIndex,
                    'Grade progression should be sequential'
                );
                $currentGradeIndex = max($currentGradeIndex, $stepGradeIndex);
            }
        }
    }

    private function validateDurationConstraints($projection)
    {
        foreach ($projection as $step) {
            if ($step['type'] === 'INTEGRATION') {
                $this->assertEquals(24, $step['duration'], 'Integration phase should be 24 months');
            } elseif ($step['type'] === 'STAGE') {
                $this->assertEquals(12, $step['duration'], 'Stage should be 12 months');
            }
        }
    }

    private function createMockAgent($category, $birthdate = '1990-01-01')
    {
        $agent = $this->createMock(Agent::class);
        $agent->method('getAttribute')->willReturnMap([
            ['categorie', (object)['nom' => $category]],
            ['date_naissance', $birthdate]
        ]);
        return $agent;
    }

    private function createMockContract($agent, $type, $phase)
    {
        $contract = $this->createMock(Contrat::class);
        $contract->method('getAttribute')->willReturnMap([
            ['type', $type],
            ['contract_phase', $phase],
            ['date_debut', Carbon::now()->subMonths(12)],
            ['date_fin', Carbon::now()->addMonths(12)]
        ]);
        return $contract;
    }
}