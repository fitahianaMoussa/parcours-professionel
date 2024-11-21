<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arrete extends Model
{
    use HasFactory;

    protected $fillable = [
        'numero_arrete',
        'date_arrete',
        'date_effet',
        'type_arrete',
        'objet',
        'signataire',
        'reference_anterieure',
        'lieu_signature',
        'contrat_id', // if you store the foreign key in `arretes` table
    ];

    public function contrat()
{
    return $this->belongsTo(Contrat::class);
}
}
