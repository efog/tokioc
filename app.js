var ioc = require('./tokioc');
console.log('ioc loaded');
/**
 * Test code
 */
var Obj1 = function (obj2) {
    var self = this;
    self.obj2 = obj2;
    self.now = new Date().getTime() - 1000;
};
var Obj2 = function () {
    var self = this;
    self.now = new Date().getTime() - 200;
};
var now = new Date().getTime();
ioc.register('objByRef3', Obj2);
var hasRegistration = ioc.hasRegistration('objByRef3');

Obj1.$dependencies = ['objByRef3'];
ioc.register('objByRef2', Obj1);
hasRegistration = ioc.hasRegistration('objByRef2');

ioc.resolve('objByRef2', function (instance) {
    console.log('');
});