<?php

namespace Biigle\Tests\Modules\Volumes\Http\Controllers;

use ApiTestCase;

class VolumeControllerTest extends ApiTestCase
{
    public function testIndex()
    {
        $id = $this->volume()->id;

        // not logged in
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(302);

        // doesn't belong to project
        $this->beUser();
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(403);

        $this->beGuest();
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(200);

        $this->beEditor();
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(200);

        $this->beExpert();
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(200);

        $this->beAdmin();
        $response = $this->get("volumes/{$id}");
        $response->assertStatus(200);

        // doesn't exist
        $response = $this->get('projects/-1');
        $response->assertStatus(404);
    }

    public function testCreate()
    {
        $id = $this->project()->id;

        // not logged in
        $response = $this->get('volumes/create');
        $response->assertStatus(302);

        $this->beEditor();
        // user is not allowed to edit the project
        $response = $this->get('volumes/create?project='.$id);
        $response->assertStatus(403);

        $this->beAdmin();
        // project doesn't exist
        $response = $this->get('volumes/create?project=-1');
        $response->assertStatus(404);

        $response = $this->get('volumes/create?project='.$id);
        $response->assertStatus(200);
    }

    public function testEdit()
    {
        $id = $this->volume()->id;

        $this->beUser();
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(403);

        $this->beGuest();
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(403);

        $this->beEditor();
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(403);

        $this->beExpert();
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(403);

        // even the volume creator is not allowed if they are no project admin
        $this->be($this->volume()->creator);
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(403);

        $this->beAdmin();
        $response = $this->get("volumes/edit/{$id}");
        $response->assertStatus(200);

        $response = $this->get('volumes/edit/999');
        $response->assertStatus(404);
    }
}
