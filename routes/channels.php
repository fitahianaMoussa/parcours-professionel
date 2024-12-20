<?php

use App\Models\Agent;
use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('retirement-notifications', function ($user) {
    return $user->hasRole('admin') || $user->hasRole('hr');
});

Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('test-channel', function ($user) {
    return true; // autorise tous les utilisateurs
});





Broadcast::channel('notifications', function ($user) {
    return auth()->check(); // Only authenticated users
});

Broadcast::channel('agent.{agentId}', function ($user, $agentId) {
    $agent = Agent::find($agentId);
    return $agent && ($user->id === $agent->user_id || $user->hasRole('RH'));
});

