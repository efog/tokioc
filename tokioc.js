'use strict';
function Tokioc() {
    var _containerLifetimeResolutionManager;
    /**
     *  Container lifetime manager
     */
    var ContainerLifetimeResolutionManager = function () {
        var _instances = {};
        function setInstance(name, target) {
            _instances[name] = target;
        }
        /**
         * Gets instance by name
         */
        function getInstance(name) {
            return _instances[name];
        }
        this.setInstance = setInstance;
        this.getInstance = getInstance;
    };
    /**
     * Registration class
     * @param name registration name
     * @param target IOC registration target
     * @param dependencies dependencies array
     * @param container ioc parent conainer
     */
    var Registration = function (name, target, dependencies, lifetimeManager) {
        this._name = name;
        this._target = target;
        this._dependencies = dependencies;
        this._lifetimeManager = lifetimeManager;

        Object.defineProperty(this, 'name', {
            get: function () { return this._name; }
        });
        Object.defineProperty(this, 'target', {
            get: function () { return this._target; }
        });
        Object.defineProperty(this, 'dependencies', {
            get: function () { return this._dependencies; }
        });
        Object.defineProperty(this, 'lifetimeManager', {
            get: function () { return this._lifetimeManager; },
            set: function (value) { this._lifetimeManager = value; }
        });
        return this;
    };

    var self = this;
    self.registrations = {};
    /**
     * Registers target resource by name
     * @param name registration name
     * @param target target registered
     * @return registration object
     */
    function register(name, target, lifetimeManager) {
        if (!name) { throw new Error('name is required'); }
        if (!target) { throw new Error('target is required'); }
        if (self.registrations[name]) { throw new Error('duplicate registration of ' + name); }

        lifetimeManager = !lifetimeManager ? _containerLifetimeResolutionManager : lifetimeManager;
        var registration = new Registration(name, target, target.$dependencies, lifetimeManager);
        self.registrations[name] = registration;

        return registration;
    }
    self.register = register;
    /**
     * Resolves resource
     * @param name registration name
     * @param callback resolution callback
     * @param ancestors array of parents
     */
    function resolve(name, callback, ancestors) {
        var registration = self.registrations[name];
        var resolveCallback = function (instance) {
            registration.lifetimeManager.setInstance(name, instance);
            return callback(instance);
        };
        if (!registration) { throw 'unknown registration for ' + name + (ancestors && typeof (ancestors) === Array) ? ancestors.join(' <-- ') : ''; }
        var lifetimeInstance = registration.lifetimeManager.getInstance(name);
        if (lifetimeInstance) {
            return resolveCallback(lifetimeInstance);
        }
        if (typeof (registration.target) !== 'function') {
            return resolveCallback(resolveInstance(name).target);
        }
        else {
            return resolveReference(name, !ancestors ? [] : ancestors, resolveCallback);
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
    /**
     * Activation
     */
    _containerLifetimeResolutionManager = new ContainerLifetimeResolutionManager(this);
}
module.exports = new Tokioc();