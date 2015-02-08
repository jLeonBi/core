<?php

use Illuminate\Database\Seeder;
use Dias\User;

class UserTableSeeder extends Seeder {

	public function run()
	{
		DB::table('users')->delete();

		User::create(array(
			'firstname' => 'Joe',
			'lastname'  => 'User',
			'email'     => 'joe@user.com',
			'password'  => Hash::make('joespassword'),
		));

		User::create(array(
			'firstname' => 'Jane',
			'lastname'  => 'User',
			'email'     => 'jane@user.com',
			'password'  => Hash::make('janespassword'),
		));
	}

}