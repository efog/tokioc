#Tokioc
##A very simple IOC container for NodeJS
________________________________________
[![Code Climate](https://codeclimate.com/github/efog/tokioc/badges/gpa.svg)](https://codeclimate.com/github/efog/tokioc)[![Issue Count](https://codeclimate.com/github/efog/tokioc/badges/issue_count.svg)](https://codeclimate.com/github/efog/tokioc)
________________________________________
###How to use
####Install Tokioc
        npm install tokioc
####Get Tokioc container instance
```javascript
var ioc = require('tokioc');
```
####Registration

   Tokioc supports the registration of objects and constructors.

#####Object registration
```javascript
var target = {
    propA: 'propA'
};
ioc.register('objByNameSingleInstance', target);
```

#####Constructor registration
```javascript
var Target = function () {
    var self = this;
    self.now = new Date();
};
ioc.register('objByNameCtor', Target);
```
####Customizable lifetime manager
Tokioc comes by default with a simple instance manager which caches resolved instances. Lifetime managers can be customized for different purposes. 
Lifetime managers must support setInstance and getInstance methods.
```javascript
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
```
Register a dependency with a custom lifetime manager:
```javascript
ioc.register('objByNameCtor', Target, new CustomLifetimeManager());
```
####Dependencies

Dependencies can only be declared on constructor registrations. Declare dependencies this way:
```javascript
var Obj1 = function (obj2) {
    var self = this;
    self.obj2 = obj2;
};
var Obj2 = function () {
    var self = this;
};
ioc.register('objByNameCtor', Obj1);
ioc.register('objByNameCtor2', Obj2);
Obj1.$dependencies = ['objByNameCtor2'];
```
Keep in mind that the constructor dependencies are applied in the order of the $dependencies array.
####Resolution

Resolve using the resolve method:
   
```javascript
ioc.resolve('objByRef5', function (instance) { /* Do what you will with the resolution */ });
```
