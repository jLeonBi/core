<?php

namespace Biigle;

use Biigle\Traits\HasJsonAttributes;
use Cache;
use Carbon\Carbon;
use DB;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

/**
 * A volume is a collection of images. Volumes belong to one or many
 * projects.
 */
class Volume extends Model
{
    use HasJsonAttributes;

    /**
     * Regular expression that matches the supported image file extensions.
     * This regex allows optional HTTP query parameters after the file names, too.
     * Example "image.jpg?raw=1".
     * This may be required for remote images with services like Dropbox.
     *
     * @var string
     */
    const IMAGE_FILE_REGEX = '/\.(jpe?g|png|tif?f)(\?.+)?$/i';

    /**
     * Regular expression that matches the supported video file extensions.
     * This regex allows optional HTTP query parameters after the file names, too.
     * Example "video.mp4?raw=1".
     * This may be required for remote files with services like Dropbox.
     *
     * @var string
     */
    const VIDEO_FILE_REGEX = '/\.(mpeg|mp4|webm)(\?.+)?$/i';

    /**
     * The attributes hidden from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'pivot',
        'attrs',
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'attrs' => 'array',
        'media_type_id' => 'int',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['video_link', 'gis_link', 'doi'];

    /**
     * Parses a comma separated list of filenames to an array.
     *
     * @param string $string
     *
     * @return array
     */
    public static function parseFilesQueryString(string $string)
    {
        // Remove whitespace as well as enclosing '' or "".
        return preg_split('/[\"\'\s]*,[\"\'\s]*/', trim($string, " \t\n\r\0\x0B'\""), null, PREG_SPLIT_NO_EMPTY);
    }

    /**
     * Scope a query to all volumes that are accessible by a user.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param User $user
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAccessibleBy($query, User $user)
    {
        if ($user->can('sudo')) {
            return $query;
        }

        return $query->whereIn('id', function ($query) use ($user) {
            return $query->select('project_volume.volume_id')
                ->from('project_volume')
                ->join('project_user', 'project_user.project_id', '=', 'project_volume.project_id')
                ->where('project_user.user_id', $user->id)
                ->distinct();
        });
    }

    /**
     * The user that created the volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function creator()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The media type of this volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function mediaType()
    {
        return $this->belongsTo(MediaType::class);
    }

    /**
     * The images belonging to this volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function images()
    {
        return $this->hasMany(Image::class);
    }

    /**
     * The videos belonging to this volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    /**
     * The images or videos belonging to this volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function files()
    {
        if ($this->isImageVolume()) {
            return $this->images();
        }

        return $this->videos();
    }

    /**
     * The images belonging to this volume ordered by filename (ascending).
     *
     * @deprecated Use `orderedFiles` instead.
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderedImages()
    {
        return $this->orderedFiles();
    }

    /**
     * The images belonging to this volume ordered by filename (ascending).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function orderedFiles()
    {
        return $this->files()->orderBy('filename', 'asc');
    }

    /**
     * Return a query for all users associated to this volume through projects.
     *
     * @return  \Illuminate\Database\Eloquent\Builder
     */
    public function users()
    {
        return User::whereIn('id', function ($query) {
            $query->select('user_id')
                ->distinct()
                ->from('project_user')
                ->whereIn('project_id', function ($query) {
                    $query->select('project_id')
                        ->from('project_volume')
                        ->where('volume_id', $this->id);
                });
        });
    }

    /**
     * The project(s), this volume belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class);
    }

    /**
     * The annotation sessions of this volume.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function annotationSessions()
    {
        return $this->hasMany(AnnotationSession::class)->with('users');
    }

    /**
     * The active annotation sessions of this volume (if any).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function activeAnnotationSession()
    {
        $now = Carbon::now();

        return $this->hasOne(AnnotationSession::class)
            ->where('starts_at', '<=', $now)
            ->where('ends_at', '>', $now)
            ->limit(1);
    }

    /**
     * Returns the active annotation session of this volume for the given user.
     *
     * An annotation session may be active for a volume but it is only also active for
     * a user, if the user belongs to the set of restricted users of the annotation
     * session.
     *
     * @param User $user
     * @return AnnotationSession
     */
    public function getActiveAnnotationSession(User $user)
    {
        return $this->activeAnnotationSession()
            ->whereExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('annotation_session_user')
                    ->where('annotation_session_user.user_id', $user->id)
                    ->whereRaw('annotation_session_user.annotation_session_id = annotation_sessions.id');
            })->first();
    }

    /**
     * Check if the given annotation session is in conflict with existing ones.
     *
     * A conflict exists if the active time period of two sessions overlaps.
     *
     * @param AnnotationSession $session The annotation session to check
     *
     * @return bool
     */
    public function hasConflictingAnnotationSession(AnnotationSession $session)
    {
        return $this->annotationSessions()
            ->when(!is_null($session->id), function ($query) use ($session) {
                return $query->where('id', '!=', $session->id);
            })
            ->where(function ($query) use ($session) {
                $query->where(function ($query) use ($session) {
                    $query->where('starts_at', '<=', $session->starts_at)
                        ->where('ends_at', '>', $session->starts_at);
                });
                $query->orWhere(function ($query) use ($session) {
                    // ends_at is exclusive so it may equal starts_at of another session
                    $query->where('starts_at', '<', $session->ends_at)
                        ->where('ends_at', '>=', $session->ends_at);
                });
                $query->orWhere(function ($query) use ($session) {
                    $query->where('starts_at', '>=', $session->starts_at)
                        ->where('ends_at', '<=', $session->ends_at);
                });
            })
            ->exists();
    }

    /**
     * Check if the images of this volume come from a remote URL.
     *
     * @return bool
     */
    public function isRemote()
    {
        return strpos($this->url, 'http') === 0;
    }

    /**
     * An image that can be used as unique thumbnail for this volume.
     *
     * @return Image
     */
    public function getThumbnailAttribute()
    {
        $thumbnails = $this->thumbnails;

        return $thumbnails->get(intdiv($thumbnails->count() - 1, 2));
    }

    /**
     * URL to the thumbnail image of this volume.
     *
     * @return string
     */
    public function getThumbnailUrlAttribute()
    {
        return $this->thumbnail ? $this->thumbnail->thumbnailUrl : null;
    }

    /**
     * Several images or videos that can be used for the preview thumbnail of a volume.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getThumbnailsAttribute()
    {
        // We can cache this for 1 hour because it's unlikely to change as long as the
        // volume exists.
        return Cache::remember("volume-thumbnails-{$this->id}", 3600, function () {
            $number = 10;
            $total = $this->files()->count();
            $query = $this->orderedFiles();
            $step = intdiv($total, $number);

            return $this->orderedFiles()
                ->when($step > 1, function ($query) use ($step) {
                    $query->whereRaw("(id % {$step}) = 0");
                })
                ->limit($number)
                ->get();
        });
    }

    /**
     * URLs to the thumbnail images of this volume.
     *
     * @return array
     */
    public function getThumbnailsUrlAttribute()
    {
        return $this->thumbnails->map(function ($file) {
            return $file->thumbnailUrl;
        });
    }

    /**
     * Flush the cache that stores the volume thumbnail.
     */
    public function flushThumbnailCache()
    {
        Cache::forget("volume-thumbnails-{$this->id}");
    }

    /**
     * Check if the volume has some images with GPS coordinates.
     *
     * @return bool
     */
    public function hasGeoInfo()
    {
        return Cache::remember("volume-{$this->id}-has-geo-info", 3600, function () {
            return $this->images()->whereNotNull('lng')->whereNotNull('lat')->exists();
        });
    }

    /**
     * Flush the cached information if this volume has images with GPS coordinates.
     */
    public function flushGeoInfoCache()
    {
        Cache::forget("volume-{$this->id}-has-geo-info");
        $this->projects->each(function ($p) {
            $p->flushGeoInfoCache();
        });
    }

    /**
     * Set the url attribute of this volume.
     *
     * @param string $value
     */
    public function setUrlAttribute($value)
    {
        return $this->attributes['url'] = $value ? rtrim($value, '/') : $value;
    }

    /**
     * Set the video_link attribute of this volume.
     *
     * @param string $value
     */
    public function setVideoLinkAttribute($value)
    {
        return $this->setJsonAttr('video_link', $value);
    }

    /**
     * Get the video_link attribute of this volume.
     *
     * @return string
     */
    public function getVideoLinkAttribute()
    {
        return $this->getJsonAttr('video_link');
    }

    /**
     * Set the gis_link attribute of this volume.
     *
     * @param string $value
     */
    public function setGisLinkAttribute($value)
    {
        return $this->setJsonAttr('gis_link', $value);
    }

    /**
     * Get the gis_link attribute of this volume.
     *
     * @return string
     */
    public function getGisLinkAttribute()
    {
        return $this->getJsonAttr('gis_link');
    }

    /**
     * Set the doi attribute of this volume.
     *
     * @param string $value
     */
    public function setDoiAttribute($value)
    {
        if (is_string($value)) {
            $value = preg_replace('/^https?\:\/\/doi\.org\//', '', $value);
        }

        return $this->setJsonAttr('doi', $value);
    }

    /**
     * Get the doi attribute of this volume.
     *
     * @return string
     */
    public function getDoiAttribute()
    {
        return $this->getJsonAttr('doi');
    }

    /**
     * Check if the there are tiled images in this volume.
     *
     * @return bool
     */
    public function hasTiledImages()
    {
        // Cache this for a single request because it may be called lots of times.
        return Cache::store('array')->remember("volume-{$this->id}-has-tiled", 60, function () {
            return $this->images()->where('tiled', true)->exists();
        });
    }

    /**
     * Specifies whether the volume is an image volume.
     *
     * @return boolean
     */
    public function isImageVolume()
    {
        return $this->media_type_id === MediaType::imageId();
    }

    /**
     * Specifies whether the volume is a video volume.
     *
     * @return boolean
     */
    public function isVideoVolume()
    {
        return $this->media_type_id === MediaType::videoId();
    }
}
