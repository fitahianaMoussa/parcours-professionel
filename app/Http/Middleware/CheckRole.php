<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Check if the authenticated user has one of the allowed roles
        if (!auth()->check() || !in_array(auth()->user()->role, $roles)) {
            // If not, return a 403 Forbidden response
            abort(403, 'Access denied');
        }

        return $next($request);
    }
}
