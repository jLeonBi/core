/**
 * A component that displays a single label of a label tree.
 *
 * @type {Object}
 */
biigle.$component('labelTrees.components.labelTreeLabel', {
    name: 'label-tree-label',
    template: '<li class="label-tree-label cf" :class="classObject">' +
        '<div class="label-tree-label__name" @click="toggleOpen">' +
            '<span class="label-tree-label__color" :style="colorStyle"></span>' +
            '<span v-text="label.name" @click.stop="toggleSelect"></span>' +
            '<span v-if="showFavourites" class="label-tree-label__favourite" @click.stop="toggleFavourite">' +
                '<span class="glyphicon" :class="favouriteClass" aria-hidden="true" title=""></span>' +
            '</span>' +
            '<button v-if="deletable" type="button" class="close label-tree-label__delete" :title="deleteTitle" @click.stop="deleteThis"><span aria-hidden="true">&times;</span></button>' +
        '</div>' +
        '<ul v-if="label.open" class="label-tree__list">' +
            '<label-tree-label :label="child" :deletable="deletable" :show-favourites="showFavourites" v-for="child in label.children" @select="emitSelect" @deselect="emitDeselect" @delete="emitDelete" @add-favourite="emitAddFavourite" @remove-favourite="emitRemoveFavourite"></label-tree-label>' +
        '</ul>' +
    '</li>',
    props: {
        label: {
            type: Object,
            required: true,
        },
        showFavourites: {
            type: Boolean,
            required: false,
        },
        deletable: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        classObject: function () {
            return {
                'label-tree-label--selected': this.label.selected,
                'label-tree-label--expandable': this.label.children,
            };
        },
        colorStyle: function () {
            return {
                'background-color': '#' + this.label.color
            };
        },
        favouriteClass: function () {
            return {
                'glyphicon-star-empty': !this.label.favourite,
                'glyphicon-star': this.label.favourite,
            };
        },
        deleteTitle: function () {
            return 'Remove label ' + this.label.name;
        }
    },
    methods: {
        toggleSelect: function () {
            if (!this.label.selected) {
                this.$emit('select', this.label);
            } else {
                this.$emit('deselect', this.label);
            }
        },
        // a method called 'delete' didn't work
        deleteThis: function () {
            this.emitDelete(this.label);
        },
        toggleOpen: function () {
            // If the label cannot be opened, it will be selected here instead.
            if (!this.label.children) {
                this.toggleSelect();
            } else {
                this.label.open = !this.label.open;
            }
        },
        toggleFavourite: function () {
            if (!this.label.favourite) {
                this.emitAddFavourite(this.label);
            } else {
                this.emitRemoveFavourite(this.label);
            }
        },
        emitSelect: function (label) {
            this.$emit('select', label);
        },
        emitDeselect: function (label) {
            this.$emit('deselect', label);
        },
        emitDelete: function (label) {
            this.$emit('delete', label);
        },
        emitAddFavourite: function (label) {
            this.$emit('add-favourite', label);
        },
        emitRemoveFavourite: function (label) {
            this.$emit('remove-favourite', label);
        },
    }
});
