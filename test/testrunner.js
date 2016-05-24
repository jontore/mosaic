(function() {
  'use strict';
  var TestRunner = function() {
    this.sets = [];
  };

  TestRunner.prototype.describe = function(description, tests) {
    this.sets.push({ description: description, tests: tests});
  };

  TestRunner.prototype.run = function() {
    var allpassed = this.sets.every(function(set) {
      var setDescrption = set.description
      var tests = set.tests;

      var setup = tests.setup;
      delete tests.setup;

      var testKeys = Object.keys(tests);
      return testKeys.every(function(testDescription) {
        setup();
        var testPassed = tests[testDescription]();
        if(!testPassed) {
          console.error('--- FAILED ----', setDescrption + ',   ' + testDescription);
        }
        return testPassed;
      });
    });

    if (allpassed) {
      console.log('------ OMG ____ ALL TESTS ARE GREEN ----');
    }
  };


  window.TestRunner = new TestRunner();
})();
