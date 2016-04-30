var ioc = require('./tokioc');
console.log('ioc loaded');
/**
 * Test code
 */
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

ioc.resolve('objByRef4', function (instance) { });