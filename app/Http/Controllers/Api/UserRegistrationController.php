<?php

namespace Biigle\Http\Controllers\Api;

use Biigle\User;
use Biigle\Role;
use Illuminate\Validation\ValidationException;
use Biigle\Notifications\RegistrationAccepted;
use Biigle\Notifications\RegistrationRejected;

class UserRegistrationController extends Controller
{
    /**
     * Creates a new instance.
     */
    public function __construct()
    {
        $this->middleware('can:sudo');
    }

    /**
     * Approves a user sign up.
     *
     * @api {get} accept-user-registration/:id Approve a user sign up
     * @apiGroup Users
     * @apiName ApproveUserSignup
     * @apiPermission admin
     * @apiDescription The approved user will be notified.
     *
     * @apiParam {Number} id The user ID.
     *
     * @param int $id User ID
     * @return mixed
     */
    public function accept($id)
    {
        if (!config('biigle.user_registration_confirmation')) {
            abort(404);
        }

        $user = User::where('role_id', Role::guestId())->findOrFail($id);
        $user->role_id = Role::editorId();
        $user->save();

        $user->notify(new RegistrationAccepted);

        if (!$this->isAutomatedRequest()) {
            return redirect()->route('admin-users-show', $user->id)
                ->with('messageType', 'success')
                ->with('message', 'The user has been accepted as editor');
        }
    }

    /**
     * Reject a user sign up.
     *
     * @api {get} reject-user-registration/:id Reject a user sign up
     * @apiGroup Users
     * @apiName RejectUserSignup
     * @apiPermission admin
     * @apiDescription The rejected user will be notified and deleted.
     *
     * @apiParam {Number} id The user ID.
     *
     * @param int $id
     * @return mixed
     */
    public function reject($id)
    {
        if (!config('biigle.user_registration_confirmation')) {
            abort(404);
        }

        $user = User::where('role_id', Role::guestId())->findOrFail($id);
        $user->notifyNow(new RegistrationRejected);
        $user->delete();

        if (!$this->isAutomatedRequest()) {
            return redirect()->route('admin-users')
                ->with('messageType', 'success')
                ->with('message', 'The user has been deleted');
        }
    }
}
