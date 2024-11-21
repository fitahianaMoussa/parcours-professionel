<?php

return [
    'grades' => [
        'integration' => [
            'phases' => [
                ['duree_mois' => 24, 'echelon' => 1],
                ['duree_mois' => 24, 'echelon' => 2],
                ['duree_mois' => 24, 'echelon' => 3],
            ],
            'next_status' => 'stagiaire',
            'next_grade' => '2eme_classe',
        ],

        '2eme_classe' => [
            'phases' => [
                ['echelon' => 1, 'duree_mois' => 24],
                ['echelon' => 2, 'duree_mois' => 24],
                ['echelon' => 3, 'duree_mois' => 36],
            ],
            'next_status' => 'titulaire',
            'next_grade' => '1er_classe',
        ],

        '1er_classe' => [
            'phases' => [
                ['echelon' => 1, 'duree_mois' => 24],
                ['echelon' => 2, 'duree_mois' => 24],
                ['echelon' => 3, 'duree_mois' => 36],
            ],
            'next_grade' => 'principal',
        ],

        'principal' => [
            'phases' => [
                ['echelon' => 1, 'duree_mois' => 36],
                ['echelon' => 2, 'duree_mois' => 36],
                ['echelon' => 3, 'duree_mois' => 36],
            ],
            'next_grade' => 'special',
        ],

        'special' => [
            'phases' => [
                ['echelon' => 1, 'duree_mois' => 48],
                ['echelon' => 2, 'duree_mois' => 48],
            ],
            'next_grade' => 'exceptionnel',
        ],

        'exceptionnel' => [
            'phases' => [
                ['echelon' => 1, 'duree_mois' => 60],
            ],
            // This is the final grade with no next_grade.
        ],
    ],

    'final_grade' => 'exceptionnel',
];
