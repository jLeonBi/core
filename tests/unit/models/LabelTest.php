<?php

use Dias\Label;

class LabelTest extends ModelTestCase
{
    /**
     * The model class this class will test.
     */
    protected static $modelClass = Dias\Label::class;

    public function testAttributes()
    {
        $this->assertNotNull($this->model->name);
        $this->assertNotNull($this->model->color);
        $this->assertNull($this->model->created_at);
        $this->assertNull($this->model->updated_at);
    }

    public function testNameRequired()
    {
        $this->model->name = null;
        $this->setExpectedException('Illuminate\Database\QueryException');
        $this->model->save();
    }

    public function testColorRequired()
    {
        $this->model->color = null;
        $this->setExpectedException('Illuminate\Database\QueryException');
        $this->model->save();
    }

    public function testParent()
    {
        $parent = self::create();
        $child = self::create(['parent_id' => $parent->id]);
        $this->assertEquals($parent->id, $child->parent->id);
    }

    public function testParentOnDeleteCascade()
    {
        $parent = self::create();
        $child = self::create(['parent_id' => $parent->id]);
        $parent->delete();
        $this->assertNull($child->fresh());
    }

    public function testTree()
    {
        $tree = LabelTreeTest::create();
        $label = self::create(['label_tree_id' => $tree->id]);
        $this->assertEquals($tree->id, $label->tree->id);
    }

    public function testLabelTreeOnDeleteCascade()
    {
        $tree = LabelTreeTest::create();
        $label = self::create(['label_tree_id' => $tree->id]);
        $tree->delete();
        $this->assertNull($label->fresh());
    }

    public function testChildren()
    {
        $parent = self::create();
        $child = self::create(['parent_id' => $parent->id]);
        $this->assertEquals($child->id, $parent->children()->first()->id);
    }

    public function testHasChildren()
    {
        $parent = self::create();
        $child = self::create();
        $this->assertFalse($parent->hasChildren);
        $child->parent()->associate($parent);
        $child->save();
        $this->assertTrue($parent->hasChildren);
    }

    public function testSetColorAttribute()
    {
        $label = self::create();
        $label->color = '#aabbcc';
        $this->assertEquals('aabbcc', $label->color);
    }
}
