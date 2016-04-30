describe('should be able to register objects for injection', function () {
    var Tokioc = require('../../tokioc');
    var ioc = Tokioc;
    it('requires a name', function () {
        expect(function () { ioc.register(undefined, undefined); }).toThrow(new Error('name is required'));
    });
    it('requires an object', function () {
        expect(function () { ioc.register('target', undefined); }).toThrow(new Error('target is required'));
    });
    it('can\'t register duplicates', function () {
        ioc.register('target', {});
        expect(function () { ioc.register('target', {}); }).toThrow(new Error('duplicate registration of target'));
    });
    it('registers objects by name', function () {
        var target = {};
        ioc.register('objByName', target);
        var hasRegistration = ioc.hasRegistration('objByName');
        expect(hasRegistration).toBe(true);
    });
});
describe('should be able to register instantiated objects and resolve using default lifetime manager', function () {
    var Tokioc = require('../../tokioc');
    var ioc = Tokioc;
    it('registers twice one object by name and resolves same instance', function () {
        var target = {
            propA: 'propA'
        };
        ioc.register('objByNameSingleInstance', target);
        var hasRegistration = ioc.hasRegistration('objByNameSingleInstance');
        expect(hasRegistration).toBe(true);
        ioc.resolve('objByNameSingleInstance', function (resolve1) {
            ioc.resolve('objByNameSingleInstance', function (resolve2) {
                expect(resolve1).toBeDefined();
                expect(resolve2).toBeDefined();
                expect(resolve1 === resolve2).toBe(true);
                expect(resolve1.propA).toEqual(resolve2.propA);
            });
        });

    });
    it('registers two objects by name and resolves different instances', function () {
        var target1 = {
            propA: 'propA'
        };
        var target2 = {
            propB: 'propB'
        };
        ioc.register('twoObjects1', target1);
        ioc.register('twoObjects2', target2);
        var hasRegistration = false;
        hasRegistration = ioc.hasRegistration('twoObjects1');
        expect(hasRegistration).toBe(true);
        hasRegistration = ioc.hasRegistration('twoObjects2');
        expect(hasRegistration).toBe(true);
        ioc.resolve('twoObjects1', function (resolve1) {
            ioc.resolve('twoObjects2', function (resolve2) {
                expect(resolve1).toBeDefined();
                expect(resolve2).toBeDefined();

                expect(resolve1 !== resolve2).toBe(true);
                expect(resolve1.propA).not.toEqual(resolve2.propA);
            });
        });
    });
});
describe('should be able to register uninstantiated objects and resolve using default lifetime manager', function () {
    var Tokioc = require('../../tokioc');
    var ioc = Tokioc;
    it('registers one constructor and resolution instantiates object', function () {
        var Obj = function () {
            var self = this;
            self.now = new Date();
        };
        var now = new Date().getTime();
        setTimeout(function () {
            ioc.register('objByRef1', Obj);
            var hasRegistration = ioc.hasRegistration('objByRef1');
            expect(hasRegistration).toBe(true);
            ioc.resolve('objByRef1', function (instance) {
                expect(instance).toBeDefined();
                expect(now).not.toEqual(instance.now.getTime());
                expect(now).not.toBeGreaterThan(instance.now.getTime());
                expect(instance.now.getTime()).toBeGreaterThan(now);
            });
        }, 100);
    });
    it('registers two uninstantiated objects and resolution instantiates object with one dependency', function () {
        var Obj1 = function (obj2) {
            var self = this;
            self.obj2 = obj2;
            self.now = new Date().getTime() - 1000;
        };
        var Obj2 = function () {
            var self = this;
            self.now = new Date().getTime();
        };
        var now = new Date().getTime();
        setTimeout(function () {

            ioc.register('objByRef3', Obj2);
            var hasRegistration = ioc.hasRegistration('objByRef3');
            expect(hasRegistration).toBe(true);

            Obj1.$dependencies = ['objByRef3'];
            ioc.register('objByRef2', Obj1);
            hasRegistration = ioc.hasRegistration('objByRef2');
            expect(hasRegistration).toBe(true);

            ioc.resolve('objByRef2', function (instance) {
                expect(instance).toBeDefined();
                expect(now).not.toEqual(instance.now.getTime());
                expect(now).not.toBeGreaterThan(instance.now.getTime());
                expect(instance.now.getTime()).toBeGreaterThan(now);
                expect(instance.obj2).toBeDefined();
                expect(instance.obj2.now).toBeGreaterThan(instance.now);
            });
        }, 100);
    });
    it('detects circular dependencies', function () {
        var Obj1 = function (obj2) {
            var self = this;
            self.obj2 = obj2;
        };
        var Obj2 = function (obj1) {
            var self = this;
            self.obj1 = obj1;
        };

        Obj1.$dependencies = ['objByRef5'];
        Obj2.$dependencies = ['objByRef4'];
        ioc.register('objByRef4', Obj1);
        ioc.register('objByRef5', Obj2);

        expect(function () { ioc.resolve('objByRef4', function (instance) { }); }).toThrow(new Error('circular dependencies detected: objByRef4 --> objByRef5 --> objByRef4'));
    });
});
