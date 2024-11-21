<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    public function avancements()
    {
        return $this->hasMany(Avancement::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    protected $dates = [
        'date_entree', 
        'date_de_naissance', 
        'retirement_date'
    ];

    public function isApproachingRetirement()
    {
        $retirementAge = 60; // Standard retirement age
        return Carbon::now()->diffInYears($this->date_de_naissance) >= $retirementAge;
    }

    public function scopeRetirees($query)
    {
        return $query->where('status', 'retraite');
    }

    public function initiateRetirement()
    {
        $this->retirement_date = now();
        $this->status = 'retraite';
        $this->save();
    }

      // Define the custom scope for approaching retirement
      public function scopeIsApproachingRetirement($query)
      {
          // Example: Assuming employees who are 5 years away from retirement (60 years old)
          $retirementAge = 60; // You can adjust this to fit your specific needs
          $currentYear = now()->year;
  
          return $query->whereYear('date_entree', '<', $currentYear - ($retirementAge - 5));
      }
}
