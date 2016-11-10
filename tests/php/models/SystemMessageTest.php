<?php

use Dias\User;
use Dias\SystemMessage;
use Dias\Notifications\NewSystemMessageNotification;

class SystemMessageTest extends ModelTestCase
{
    /**
     * The model class this class will test.
     */
    protected static $modelClass = Dias\SystemMessage::class;

    public function testAttributes()
    {
        $this->assertNotNull($this->model->created_at);
        $this->assertNotNull($this->model->updated_at);
        $this->assertNotNull($this->model->body);
        $this->assertNotNull($this->model->title);
        $this->assertNotNull($this->model->type);
    }

    public function testTitleRequired()
    {
        $this->model->title = null;
        $this->setExpectedException('Illuminate\Database\QueryException');
        $this->model->save();
    }

    public function testBodyRequired()
    {
        $this->model->body = null;
        $this->setExpectedException('Illuminate\Database\QueryException');
        $this->model->save();
    }

    public function testPublish()
    {
        UserTest::create();
        UserTest::create();

        $this->assertNull($this->model->published_at);
        Notification::shouldReceive('send')
            ->once()
            ->with(Mockery::on(function ($users) {
                // should be all users
                return User::all()->diff($users)->count() === 0;
            }), Mockery::type(NewSystemMessageNotification::class));
        $this->model->publish();
        // Already published messages aren't published again.
        $this->model->publish();
    }

    public function testIsPublished()
    {
        $this->assertFalse($this->model->isPublished());
        $this->model->publish();
        $this->asserttrue($this->model->isPublished());
    }
}
