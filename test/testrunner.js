(function() {
  'use strict';
  var TestRunner = function() {
    this.sets = [];
  };

  TestRunner.prototype.describe = function(description, tests) {
    this.sets.push({ description: description, tests: tests});
  };

  TestRunner.prototype.run = function() {
    var setPromises = this.sets.reduce(function(setPromises, set) {
      var setDescrption = set.description
      var tests = set.tests;

      var setup = tests.setup;
      delete tests.setup;

      var after = tests.after;
      delete tests.after;

      var testKeys = Object.keys(tests);
      var testPromises = testKeys.map(function(testDescription) {
        if (typeof setup === 'function') {
          setup();
        }
        var testPassed = tests[testDescription]();

        var testPromise = testPassed;
        if(typeof testPassed === 'boolean') {
          testPromise = new Promise(function(resolve, reject) {
            if (testPassed) {
              resolve(testDescription);
            } else {
              reject(testDescription);
            }
          });
        }

        if (typeof after === 'function') {
          after();
        }

        return testPromise;
      });

      return setPromises.concat(testPromises);
    }, []);

    return new Promise(function(resolve, reject) {
      var timeout = setTimeout(function () {
        reject('-timeedouts');
        console.error('--- FAILED TIMEOUT ----');
      }, 3000);

      Promise.all(setPromises).then(function() {
        clearTimeout(timeout);
        console.log('------ OMG ____ ALL TESTS ARE GREEN ----');
        resolve();
      }, function() {
        clearTimeout(timeout);
        console.error('---- FAILED -----', arguments);
        reject();
      });

    });
  };


  window.TestRunner = new TestRunner();
})();
