<?php namespace Dias\Http\Controllers\Api;

use Dias\Project;
use Dias\Transect;
use Dias\Exceptions\ProjectIntegrityException;

class ProjectTransectController extends Controller {

	/**
	 * Shows a list of all transects belonging to the specified project..
	 *
	 * @param int $id Project ID
	 * @return \Illuminate\Http\Response
	 */
	public function index($id)
	{
		$project = $this->requireNotNull(Project::find($id));
		$this->requireCanSee($project);

		return $project->transects;
	}

	/**
	 * Creates a new transect associated to the specified project.
	 *
	 * @param int $id Project ID
	 * @return Transect
	 */
	public function store($id)
	{
		$project = $this->requireNotNull(Project::find($id));
		$this->requireCanAdmin($project);
		$this->validate($this->request, Transect::$createRules);

		$transect = new Transect;
		$transect->name = $this->request->input('name');
		$transect->url = $this->request->input('url');
		$transect->setMediaTypeId($this->request->input('media_type_id'));
		$transect->creator()->associate($this->user);

		$images = preg_split(
			'/\s*,\s*/',
			$this->request->input('images'),
			null,
			PREG_SPLIT_NO_EMPTY
		);

		if (empty($images) || !is_array($images))
		{
			return $this->buildFailedValidationResponse($this->request, array(
				'images' => 'No images were supplied for the new transect!'
			));
		}

		// save first, so the transect gets an ID for associating with images
		$transect->save();
		$transect->createImages($images);
		$project->addTransectId($transect->id);

		if (static::isAutomatedRequest($this->request))
		{
			// call fresh so the media type object is not included
			return $transect->fresh();
		}
		else
		{
			return redirect()->route('home')
				->with('message', 'Transect '.$transect->name.' created')
				->with('messageType', 'success');
		}
	}

	/**
	 * Attaches the existing specified transect to the existing specified
	 * project.
	 * 
	 * @param int $projectId
	 * @param int $transectId
	 * @return \Illuminate\Http\Response
	 */
	public function attach($projectId, $transectId)
	{
		// user must be able to admin the transect *and* the project it should
		// be attached to
		$transect = $this->requireNotNull(Transect::find($transectId));
		$this->requireCanAdmin($transect);
		$project = $this->requireNotNull(Project::find($projectId));
		$this->requireCanAdmin($project);

		$project->addTransectId($transect->id);
	}

	/**
	 * Removes the specified transect from the specified project.
	 * If it is the last project the transect belongs to, the transect is
	 * deleted (if the `force` argument is present in the request).
	 *
	 * @param  int  $projectId
	 * @param  int  $transectId
	 * @return \Illuminate\Http\Response
	 */
	public function destroy($projectId, $transectId)
	{
		$transect = $this->requireNotNull(Transect::find($transectId));
		$this->requireCanAdmin($transect);
		$project = $this->requireNotNull(Project::find($projectId));

		$project->removeTransectId($transectId, $this->request->has('force'));

		return response('Removed.', 200);
	}
}
