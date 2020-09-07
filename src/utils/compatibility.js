/** Gnome libs imports */
const { PACKAGE_VERSION } = imports.misc.config;

/* exported ShellVersionMatch, Allocate, AllocatePreferredSize */
var ShellVersionMatch = function (version) {
    return PACKAGE_VERSION.match(new RegExp(`^${version}`)) !== null;
};

var Allocate = function (actor, box, flags) {
    if (ShellVersionMatch('3.34') || ShellVersionMatch('3.36')) {
        actor.allocate(box, flags);
    } else {
        actor.allocate(box);
    }
};

var AllocatePreferredSize = function (actor, flags) {
    if (ShellVersionMatch('3.34') || ShellVersionMatch('3.36')) {
        actor.allocate_preferred_size(flags);
    } else {
        actor.allocate_preferred_size(0, 0);
    }
};
