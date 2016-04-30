'use strict';
function Tokioc() {

    var self = this;
    self.registrations = {};
    self.names = [];
    /**
     * Registers target resource by name
     * @param name registration name
     * @param target target registered
     */
    function register(name, target) {
        if (!name) { throw new Error('name is required'); }
        if (!target) { throw new Error('target is required'); }
        if (self.registrations[name]) { throw new Error('duplicate registration of ' + name); }
        self.registrations[name] = { name: name, target: target, dependencies: target.$dependencies };
        self.names.push(name);
    }
    self.register = register;
    /**
     * Resolves resource
     * @param name registration name
     * @param callback resolution callback
     * @param ancestors array of parents
     */
    function resolve(name, callback, ancestors) {
        if (!self.registrations[name]) { throw 'unknown registration for ' + name + (ancestors && typeof (ancestors) === Array) ? ancestors.join(' <-- ') : ''; }
        if (typeof (self.registrations[name].target) !== 'function') { return callback(resolveInstance(name).target); }
        else {
            return resolveReference(name, !ancestors ? [] : ancestors, callback);
        }
    }
    self.resolve = resolve;
    /**
     * Resolves instance by name
     * @param name registration name
     */
    function resolveInstance(name) {
        return self.registrations[name];
    }
    /**
     * Resolves reference by name
     * @param name registration name
     * @param ancestors array of parents
     */
    function resolveReference(name, ancestors, callback) {
        var registration = self.registrations[name];
        var dependencies = registration.dependencies;
        if (!dependencies || dependencies.length === 0) {
            var instance = new registration.target();
            return callback(instance);
        }
        for (var i = 0; i < ancestors.length; i++) {
            if (ancestors[i] === name) {
                throw new Error('circular dependencies detected: ' + ancestors.join(' --> ') + ' --> ' + name);
            }
        }
        ancestors.push(name);
        var resolvedDependencies = [];
        var resolutionCallback = function (resolved) {
            resolvedDependencies.push(resolved);
            if (resolvedDependencies.length === dependencies.length) {
                var instance = new registration.target();
                registration.target.apply(instance, resolvedDependencies);
                return callback(instance);
            }
        };
        for (var j = 0; j < dependencies.length; j++) {
            self.resolve(dependencies[j], resolutionCallback, ancestors);
        }
    }
    /**
     * Checks for registration entry
     * @param name registration name
     * @returns true if has registration for name
     */
    function hasRegistration(name) {
        return (self.registrations[name]) !== undefined;
    }
    self.hasRegistration = hasRegistration;
}
module.exports = new Tokioc();