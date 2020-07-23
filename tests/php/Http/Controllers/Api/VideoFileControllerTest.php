<?php

namespace Biigle\Tests\Http\Controllers\Api;

use ApiTestCase;
use Biigle\MediaType;
use Biigle\Tests\VideoTest;
use Storage;

class VideoFileControllerTest extends ApiTestCase
{
    public function testShow()
    {
        Storage::fake('test');
        Storage::disk('test')->put('files/video.mp4', 'testvideo');
        $id = $this->volume(['media_type_id' => MediaType::videoId()])->id;
        $video = VideoTest::create([
            'filename' => 'video.mp4',
            'volume_id' => $id,
        ]);

        $this->doTestApiRoute('GET', "api/v1/videos/{$video->id}/file");

        $this->beUser();
        $this->get('api/v1/videos/foo/file')->assertStatus(404);
        $this->get("api/v1/videos/{$video->id}/file")->assertStatus(403);

        $this->beGuest();
        $this->get("api/v1/videos/{$video->id}/file")->assertStatus(200);
    }

    public function testShowNotFound()
    {
        Storage::fake('test');
        $id = $this->volume(['media_type_id' => MediaType::videoId()])->id;
        $video = VideoTest::create([
            'filename' => 'video.mp4',
            'volume_id' => $id,
        ]);

        $this->beGuest();
        $this->get("api/v1/videos/{$video->id}/file")->assertStatus(404);
    }

    public function testShowPartial()
    {
        Storage::fake('test');
        Storage::disk('test')->put('files/video.mp4', 'testvideo');
        $id = $this->volume(['media_type_id' => MediaType::videoId()])->id;
        $video = VideoTest::create([
            'filename' => 'video.mp4',
            'volume_id' => $id,
            'attrs' => ['size' => 9],
        ]);

        $this->beGuest();
        $response = $this->withHeaders(['Range' => 'bytes=3-'])
            ->getJson("api/v1/videos/{$video->id}/file")
            ->assertStatus(206);

        $this->assertEquals(6, $response->headers->get('Content-Length'));
        $this->assertTrue($response->headers->has('Content-Range'));
        $this->assertEquals('bytes 3-8/9', $response->headers->get('Content-Range'));
    }

    public function testShowRemote()
    {
        $id = $this->volume([
            'media_type_id' => MediaType::videoId(),
            'url' => 'https://domain.tld',
        ])->id;
        $video = VideoTest::create([
            'filename' => 'video.mp4',
            'volume_id' => $id,
        ]);

        $this->beGuest();
        $this->get("api/v1/videos/{$video->id}/file")->assertRedirect($video->url);
    }
}
