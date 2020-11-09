<?php

namespace Biigle\Tests\Http\Controllers\Views\Projects;

use Biigle\Role;
use Biigle\Tests\ProjectTest;
use Biigle\Tests\UserTest;
use Cache;
use TestCase;

class ProjectUserControllerTest extends TestCase
{
    public function testShow()
    {
        $project = ProjectTest::create();
        $id = $project->id;
        $user = UserTest::create();

        $this->get("projects/{$id}/members")->assertStatus(302);

        $this->be($user);
        $this->get("projects/{$id}/members")->assertStatus(403);

        $project->addUserId($user->id, Role::editorId());
        Cache::flush();
        $this->get("projects/{$id}/members")->assertStatus(200);

        // doesn't exist
        $this->get('projects/-1/members')->assertStatus(404);
    }
}
