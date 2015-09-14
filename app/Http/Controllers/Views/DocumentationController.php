<?php

namespace Dias\Http\Controllers\Views;

class DocumentationController extends Controller
{
    /**
     * Show the application documentation center to the user.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('documentation');
    }

    /**
     * Show the package development tutorial.
     *
     * @param string $name Article name
     * @return \Illuminate\Http\Response
     */
    public function article($name)
    {
        if (view()->exists('documentation.'.$name)) {
            return view('documentation.'.$name);
        } else {
            abort(404);
        }
    }
}
