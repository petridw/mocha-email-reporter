const Base = require('mocha').reporters.Base;
const fs = require('fs');
const ejs = require('ejs');

const outputFile = './output.json';
const emailTemplate = ejs.compile(fs.readFileSync(`${__dirname}/lib/emailTemplate.ejs`, 'utf8'));

/**
* @param runner
* @param options (Object) - available options:
*   json: (Boolean [false]) - write json file, will be called output.json
*/
function JsonReporter(runner, options) {
  Base.call(this, runner);
  
  var reporterOptions = options && options.reporterOptions ? options.reporterOptions : {};
    
  var result = {
    suites: {},
    totalPasses: 0,
    totalFailures: 0
  };

  runner.on('suite', (suite) => {
    var title = suite.title;
    if (!title) return;
    
    result.suites[title] = {};
  });
  
  runner.on('test', (test) => {
    result.suites[test.parent.title][test.title] = {};
    result.suites[test.parent.title][test.title].start = Date.now();
  });
  
  runner.on('test end', (test) => {
    var start = result.suites[test.parent.title][test.title].start;
    result.suites[test.parent.title][test.title].duration = Date.now() - start;
    if (test.err) result.suites[test.parent.title][test.title].err = test.err;
  });
  
  runner.on('pass', (test) => {
    result.suites[test.parent.title][test.title].pass = true;
    result.totalPasses += 1;
  });

  runner.on('fail', (test, err) => {
    result.suites[test.parent.title][test.title].pass = false;
    result.totalFailures += 1;
  });

  runner.on('end', () => {
    if (reporterOptions.json) fs.writeFileSync(reporterOptions.json, JSON.stringify(result, null, 2));
    
    process.stdout.write(emailTemplate(result));
  });
}

module.exports = JsonReporter;
