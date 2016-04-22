<?php

class ApiAnnotationLabelControllerTest extends ApiTestCase
{
    private $annotation;

    public function setUp()
    {
        parent::setUp();
        $this->annotation = AnnotationTest::create();
        $this->project()->addTransectId($this->annotation->image->transect->id);
    }

    public function testIndex()
    {
        $this->annotation->addLabel($this->labelRoot()->id, 0.5, $this->editor());
        $this->doTestApiRoute('GET', '/api/v1/annotations/1/labels');

        // api key authentication
        $this->beUser();
        $this->get('/api/v1/annotations/1/labels');
        $this->assertResponseStatus(401);

        $this->beGuest();
        $this->get('/api/v1/annotations/1/labels');
        $this->assertResponseOk();

        $this->beGuest();
        $this->get('/api/v1/annotations/1/labels');

        $this->assertResponseOk();
        $content = $this->response->getContent();
        $this->assertStringStartsWith('[{', $content);
        $this->assertStringEndsWith('}]', $content);
    }

    public function testStore()
    {
        $this->doTestApiRoute('POST', '/api/v1/annotations/1/labels');

        // missing arguments
        $this->beEditor();
        $this->json('POST', '/api/v1/annotations/1/labels');
        $this->assertResponseStatus(422);

        $this->assertEquals(0, $this->annotation->labels()->count());

        $this->beUser();
        $this->post('/api/v1/annotations/1/labels', [
            'label_id' => $this->labelRoot()->id,
            'confidence' => 0.1
        ]);
        $this->assertResponseStatus(401);

        $this->beGuest();
        $this->post('/api/v1/annotations/1/labels', [
            'label_id' => $this->labelRoot()->id,
            'confidence' => 0.1
        ]);
        $this->assertResponseStatus(401);

        $this->beEditor();
        $this->post('/api/v1/annotations/1/labels', [
            'label_id' => $this->labelRoot()->id,
            'confidence' => 0.1
        ]);
        $this->assertResponseStatus(201);
        $this->assertEquals(1, $this->annotation->labels()->count());

        $this->beAdmin();
        $this->json('POST', '/api/v1/annotations/1/labels', [
            'label_id' => $this->labelRoot()->id,
            'confidence' => 0.1
        ]);
        $this->assertResponseStatus(201);
        $this->assertEquals(2, $this->annotation->labels()->count());
        $this->assertStringStartsWith('{', $this->response->getContent());
        $this->assertStringEndsWith('}', $this->response->getContent());

        $this->post('/api/v1/annotations/1/labels', [
            'label_id' => $this->labelRoot()->id,
            'confidence' => 0.1,
        ]);
        // the same user cannot attach the same label twice
        $this->assertResponseStatus(400);
        $this->assertEquals(2, $this->annotation->labels()->count());
    }

    public function testUpdate()
    {
        $annotationLabel = $this->annotation->addLabel($this->labelRoot()->id, 0.5, $this->editor());
        $id = $annotationLabel->id;

        $this->doTestApiRoute('PUT', '/api/v1/annotation-labels/'.$id);

        $this->beUser();
        $this->put('/api/v1/annotation-labels/'.$id);
        $this->assertResponseStatus(401);

        $this->beGuest();
        $this->put('/api/v1/annotation-labels/'.$id);
        $this->assertResponseStatus(401);

        $this->beEditor();
        $this->put('/api/v1/annotation-labels/'.$id);
        $this->assertResponseOk();

        $this->beAdmin();
        $this->put('/api/v1/annotation-labels/'.$id);
        $this->assertResponseOk();

        $this->assertEquals(0.5, $annotationLabel->fresh()->confidence);
        $this->beEditor();
        $this->put('/api/v1/annotation-labels/'.$id, [
            '_token' => Session::token(),
            'confidence' => 0.1,
        ]);
        $this->assertResponseOk();
        $this->assertEquals(0.1, $annotationLabel->fresh()->confidence);
    }

    public function testDestroy()
    {
        $annotationLabel = $this->annotation->addLabel($this->labelRoot()->id, 0.5, $this->editor());
        $id = $annotationLabel->id;

        $this->doTestApiRoute('DELETE', '/api/v1/annotation-labels/'.$id);

        $this->beUser();
        $this->delete('/api/v1/annotation-labels/'.$id);
        $this->assertResponseStatus(401);

        $this->beGuest();
        $this->delete('/api/v1/annotation-labels/'.$id);
        $this->assertResponseStatus(401);

        $this->assertNotNull($this->annotation->labels()->first());
        $this->beEditor();
        $this->delete('/api/v1/annotation-labels/'.$id);
        $this->assertResponseOk();
        $this->assertNull($this->annotation->labels()->first());

        $annotationLabel = $this->annotation->addLabel($this->labelRoot()->id, 0.5, $this->editor());
        $this->assertNotNull($this->annotation->labels()->first());
        $id = $annotationLabel->id;

        $this->beAdmin();
        $this->delete('/api/v1/annotation-labels/'.$id);
        $this->assertResponseOk();
        $this->assertNull($this->annotation->labels()->first());
    }
}
