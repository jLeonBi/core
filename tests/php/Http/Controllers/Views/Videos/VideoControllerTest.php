<?php

namespace Biigle\Tests\Http\Controllers\Views\Videos;

use ApiTestCase;
use Biigle\MediaType;
use Biigle\Tests\VideoTest;

class VideoControllerTest extends ApiTestCase
{
    public function testShow()
    {
        $id = $this->volume(['media_type_id' => MediaType::videoId()])->id;
        $video = VideoTest::create(['volume_id' => $id]);

        $this->beUser();
        $this->get('videos/999')->assertStatus(404);
        $this->get("videos/{$video->id}")->assertStatus(403);

        $this->beGuest();
        $this->get("videos/{$video->id}")->assertStatus(200);
        $this->markTestIncomplete('route should be videos/xxx/annotations');
    }
}
