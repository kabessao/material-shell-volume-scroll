const { Clutter, GObject, St, Meta } = imports.gi;
const Params = imports.misc.params;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const { Stack } = Me.imports.src.widget.layout;
const { RippleBackground } = Me.imports.src.widget.material.rippleBackground;
/* exported MatButton */
var MatButton = GObject.registerClass(
    {
        Signals: {
            clicked: {
                param_types: [GObject.TYPE_INT],
            },
        },
    },
    class MatButton extends St.Widget {
        _init(params = {}) {
            this.rippleBackground = new RippleBackground();
            const isPrimary = params.primary;
            delete params.primary;
            this.actorContainer = new St.Bin(params);
            this.actorContainer.add_style_class_name('mat-button-container');
            super._init({
                reactive: true,
                track_hover: true,
                clip_to_allocation: true,
            });

            this.add_child(this.rippleBackground);
            this.add_child(this.actorContainer);
            this.add_style_class_name('mat-button');
            if (isPrimary) {
                this.add_style_class_name('primary');
            }
            this.connect('event', (actor, event) => {
                let eventType = event.type();
                if (
                    [
                        Clutter.EventType.BUTTON_PRESS,
                        Clutter.EventType.TOUCH_BEGIN,
                    ].indexOf(eventType) > -1
                ) {
                    this.pressed = true;
                } else if (
                    [
                        Clutter.EventType.BUTTON_RELEASE,
                        Clutter.EventType.TOUCH_END,
                    ].indexOf(eventType) > -1
                ) {
                    if (this.pressed) {
                        this.emit('clicked', event.get_button());
                        this.pressed = false;
                    }
                } else if (eventType === Clutter.EventType.LEAVE) {
                    this.pressed = false;
                    global.display.set_cursor(Meta.Cursor.DEFAULT);
                } else if (eventType === Clutter.EventType.ENTER) {
                    global.display.set_cursor(Meta.Cursor.POINTING_HAND);
                }
            });
        }
        /**
         * Just the child width but taking into account the slided out part
         */
        vfunc_get_preferred_width(forHeight) {
            return this.actorContainer.vfunc_get_preferred_width(forHeight);
        }

        /**
         * Just the child height but taking into account the slided out part
         */
        vfunc_get_preferred_height(forWidth) {
            return this.actorContainer.vfunc_get_preferred_height(forWidth);
        }

        set_child(child) {
            this.actorContainer.set_child(child);
        }

        vfunc_allocate(box, flags) {
            this.set_allocation(box, flags);
            let themeNode = this.get_theme_node();
            const contentBox = themeNode.get_content_box(box);
            this.actorContainer.allocate(contentBox, flags);
            this.rippleBackground.allocate(contentBox, flags);
        }
    }
);
