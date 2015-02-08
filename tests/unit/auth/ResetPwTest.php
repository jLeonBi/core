<?php

class ResetPwTest extends TestCase {

	public function setUp()
	{
		parent::setUp();
		// enable XSRF tokens
		Session::start();
	}

	public function testResetRoute()
	{
		$this->call('GET', '/password/reset');
		$this->assertResponseStatus(404);
		$this->call('GET', '/password/reset/xy');
		$this->assertResponseOk();
		$this->call('POST', '/password/reset');
		$this->assertResponseStatus(403);
	}

	public function testFieldsRequired()
	{
		$this->call('GET', '/password/reset/xy');
		$this->call('POST', '/password/reset/xy', array(
			'_token'   => Session::getToken()
		));

		$this->assertRedirectedTo('/password/reset/xy');
	}

	public function testUserDoesNotExist()
	{
		$this->call('GET', '/password/reset/xy');
		$this->call('POST', '/password/reset/xy', array(
			'_token'  => Session::getToken(),
			'token'   => 'xy',
			'email'   => 'test@test.com',
			'password'   => 'testtest',
			'password_confirmation'   => 'testtest',
		));
		$this->assertRedirectedTo('/password/reset/xy');

		// get response after redirect
		$response = $this->call('GET', '/password/reset/xy');		
		$this->assertContains('We can&#039;t find a user with that e-mail address.', $response->getContent());
	}

	public function testResetSuccess()
	{
		$user = UserTest::create('test', 'user', 'pw', 'test@test.com');
		$user->save();
		$this->assertFalse(Auth::validate(array(
			'email' => 'test@test.com',
			'password' => 'testtest'
		)));

		$this->call('GET', '/password/email');
		$this->call('POST', '/password/email', array(
			'_token'  => Session::getToken(),
			'email'   => 'test@test.com'
		));

		$token = DB::table('password_resets')
			->where('email', 'test@test.com')
			->first()
			->token;

		$this->call('POST', '/password/reset/'.$token, array(
			'_token'  => Session::getToken(),
			'token'   => $token,
			'email'   => 'test@test.com',
			'password'   => 'testtest',
			'password_confirmation'   => 'testtest',
		));
		$this->assertRedirectedTo('/');
		$this->assertTrue(Auth::validate(array(
			'email' => 'test@test.com',
			'password' => 'testtest'
		)));
	}

}