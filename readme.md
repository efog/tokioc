#Tokioc
##A very simple IOC container for NodeJS
________________________________________
[![Code Climate](https://codeclimate.com/github/efog/tokioc/badges/gpa.svg)](https://codeclimate.com/github/efog/tokioc)[![Test Coverage](https://codeclimate.com/github/efog/tokioc/badges/coverage.svg)](https://codeclimate.com/github/efog/tokioc/coverage)[![Issue Count](https://codeclimate.com/github/efog/tokioc/badges/issue_count.svg)](https://codeclimate.com/github/efog/tokioc)
________________________________________
###How to use
####Install tokioc
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
####Dependencies

Dependencies can only be declared on constructor registrations. Declare dependencies this way:
```javascript
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
```
Keep in mind that the constructor dependencies are applied in the order of the $dependencies array.
####Resolution

Resolve using the resolve method:
   
```javascript
ioc.resolve('objByRef5', function (instance) { /* Do what you will with the resolution */ });
```
