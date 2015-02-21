<?php

use Dias\User;

class UserApiTest extends ApiTestCase {

	public function testIndex()
	{
		$this->doTestApiRoute('GET', '/api/v1/users');

		$this->callToken('GET', '/api/v1/users', $this->admin);
		$this->assertResponseStatus(401);

		$this->callToken('GET', '/api/v1/users', $this->globalAdmin);
		$this->assertResponseOk();

		// session cookie authentication
		$this->be($this->globalAdmin);
		$r = $this->callAjax('GET', '/api/v1/users');
		$this->assertResponseOk();
		$this->assertStringStartsWith('[', $r->getContent());
		$this->assertStringEndsWith(']', $r->getContent());
	}

	public function testShow()
	{
		$this->doTestApiRoute('GET', '/api/v1/users/'.$this->guest->id);

		$this->callToken('GET', '/api/v1/users/'.$this->guest->id, $this->guest);
		$this->assertResponseStatus(401);

		$this->callToken(
			'GET',
			'/api/v1/users/'.$this->guest->id,
			$this->globalAdmin
		);
		$this->assertResponseOk();

		$this->be($this->globalAdmin);
		$r = $this->callAjax('GET', '/api/v1/users/'.$this->guest->id);
		$this->assertResponseOk();
		$this->assertStringStartsWith('{', $r->getContent());
		$this->assertStringEndsWith('}', $r->getContent());
	}

	public function testShowOwn()
	{
		$this->doTestApiRoute('GET', '/api/v1/users/my');

		$this->callToken('GET', '/api/v1/users/my', $this->guest);
		$this->assertResponseOk();

		$this->be($this->globalAdmin);
		$r = $this->callAjax('GET', '/api/v1/users/my');
		$this->assertResponseOk();
		$this->assertStringStartsWith('{', $r->getContent());
		$this->assertStringEndsWith('}', $r->getContent());
	}

	public function testUpdate()
	{
		$this->doTestApiRoute('PUT', '/api/v1/users/'.$this->guest->id);
 		// api key authentication is not allowed for this route
		$this->callToken('PUT', '/api/v1/users/'.$this->guest->id, $this->guest);
		$this->assertResponseStatus(401);

		$this->callToken('PUT', '/api/v1/users/'.$this->guest->id, $this->globalAdmin);
		$this->assertResponseStatus(401);

		$this->be($this->guest);
		$this->callAjax('PUT', '/api/v1/users/'.$this->guest->id, array(
			'_token' => Session::token()
		));
		$this->assertResponseStatus(401);

		$this->be($this->globalAdmin);

		$this->callAjax('PUT', '/api/v1/users/'.$this->globalAdmin->id, array(
			'_token' => Session::token(),
		));
		// the own user cannot be updated via this route
		$this->assertResponseStatus(400);

		$this->callAjax('PUT', '/api/v1/users/'.$this->guest->id, array(
			'_token' => Session::token(),
			'password' => 'hacked!!'
		));
		// no password confirmation
		$this->assertResponseStatus(422);

		$this->callAjax('PUT', '/api/v1/users/'.$this->guest->id, array(
			'_token' => Session::token(),
			'email' => 'no-mail'
		));
		// invalid email format
		$this->assertResponseStatus(422);

		$this->callAjax('PUT', '/api/v1/users/'.$this->guest->id, array(
			'_token' => Session::token(),
			'password' => 'newpassword',
			'password_confirmation' => 'newpassword',
			'firstname' => 'jack',
			'lastname' => 'jackson',
			'email' => 'new@email.me'
		));
		$this->assertResponseOk();

		$user = $this->guest->fresh();
		$this->assertTrue(Hash::check('newpassword', $user->password));
		$this->assertEquals('jack', $user->firstname);
		$this->assertEquals('jackson', $user->lastname);
		$this->assertEquals('new@email.me', $user->email);
	}

	public function testUpdateOwn()
	{
		$this->guest->password = bcrypt('guest-password');
		$this->guest->save();

		$this->doTestApiRoute('PUT', '/api/v1/users/my');
 		// api key authentication is not allowed for this route
		$this->callToken('PUT', '/api/v1/users/my', $this->guest);
		$this->assertResponseStatus(401);

		$this->be($this->guest);
		$this->callAjax('PUT', '/api/v1/users/my', array(
			'_token' => Session::token(),
			'password' => 'hacked!!'
		));
		// no password confirmation
		$this->assertResponseStatus(422);

		$this->callAjax('PUT', '/api/v1/users/my', array(
			'_token' => Session::token(),
			'email' => 'no-mail'
		));
		// invalid email format
		$this->assertResponseStatus(422);

		$this->callAjax('PUT', '/api/v1/users/my', array(
			'_token' => Session::token(),
			'password' => 'newpassword',
			'password_confirmation' => 'newpassword'
		));
		// no old password provided
		$this->assertResponseStatus(422);

		$this->callAjax('PUT', '/api/v1/users/my', array(
			'_token' => Session::token(),
			'password' => 'newpassword',
			'password_confirmation' => 'newpassword',
			'old_password' => 'guest-password',
			'firstname' => 'jack',
			'lastname' => 'jackson',
			'email' => 'new@email.me'
		));
		$this->assertResponseOk();

		$user = $this->guest->fresh();
		$this->assertTrue(Hash::check('newpassword', $user->password));
		$this->assertEquals('jack', $user->firstname);
		$this->assertEquals('jackson', $user->lastname);
		$this->assertEquals('new@email.me', $user->email);
	}

	public function testStore()
	{
		$this->doTestApiRoute('POST', '/api/v1/users');

		// api key authentication is not allowed for this route
		$this->callToken('POST', '/api/v1/users', $this->globalAdmin);
		$this->assertResponseStatus(401);

		$this->be($this->admin);
		$this->callAjax('POST', '/api/v1/users', array(
			'_token' => Session::token(),
		));
		$this->assertResponseStatus(401);

		$this->be($this->globalAdmin);
		$this->callAjax('POST', '/api/v1/users', array(
			'_token' => Session::token(),
			'password' => 'newpassword',
			'firstname' => 'jack',
			'lastname' => 'jackson',
			'email' => 'new@email.me'
		));
		// no password confirmation
		$this->assertResponseStatus(422);

		$r = $this->callAjax('POST', '/api/v1/users', array(
			'_token' => Session::token(),
			'password' => 'newpassword',
			'password_confirmation' => 'newpassword',
			'firstname' => 'jack',
			'lastname' => 'jackson',
			'email' => 'new@email.me'
		));
		$this->assertResponseOk();
		$this->assertStringStartsWith('{', $r->getContent());
		$this->assertStringEndsWith('}', $r->getContent());

		$newUser = User::find(User::max('id'));
		$this->assertEquals('jack', $newUser->firstname);
		$this->assertEquals('jackson', $newUser->lastname);
		$this->assertEquals('new@email.me', $newUser->email);
	}

	public function testDestroy()
	{
		$id = $this->guest->id;
		$this->doTestApiRoute('DELETE', '/api/v1/users/'.$id);

		// api key authentication is not allowed for this route
		$this->callToken('DELETE', '/api/v1/users/'.$id, $this->globalAdmin);
		$this->assertResponseStatus(401);

		$this->be($this->admin);
		$this->callAjax('DELETE', '/api/v1/users/'.$id, array(
			'_token' => Session::token(),
		));
		$this->assertResponseStatus(401);

		$this->be($this->globalAdmin);

		$this->callAjax('DELETE', '/api/v1/users/'.$this->globalAdmin->id, array(
			'_token' => Session::token(),
		));
		// the own user cannot be deleted via this route
		$this->assertResponseStatus(400);

		$this->assertNotNull($this->guest->fresh());
		$this->callAjax('DELETE', '/api/v1/users/'.$id, array(
			'_token' => Session::token(),
		));
		$this->assertResponseOk();
		$this->assertNull($this->guest->fresh());

		// remove creator, so admin is the last remaining admin of the project
		$this->project->removeUserId($this->project->creator->id);
		$this->callAjax('DELETE', '/api/v1/users/'.$this->admin->id, array(
			'_token' => Session::token(),
		));
		// last remaining admin of a project mustn't be deleted
		$this->assertResponseStatus(400);
	}

	public function testDestroyOwn()
	{
		$this->doTestApiRoute('DELETE', '/api/v1/users/my');

		// api key authentication is not allowed for this route
		$this->callToken('DELETE', '/api/v1/users/my', $this->guest);
		$this->assertResponseStatus(401);

		$this->be($this->guest);
		$this->assertNotNull($this->guest->fresh());
		$this->callAjax('DELETE', '/api/v1/users/my', array(
			'_token' => Session::token(),
		));
		$this->assertResponseOk();
		$this->assertNull($this->guest->fresh());

		$this->callAjax('DELETE', '/api/v1/users/my', array(
			'_token' => Session::token(),
		));
		// deleted user doesn't have permission any more
		$this->assertResponseStatus(401);
	}
}