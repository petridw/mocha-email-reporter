const EmailReporter = require('..');
const Mocha = require('mocha');
const expect = require('expect');
const hookStdOut = require('../util/hookStdOut');
const fs = require('fs');

const jsonFilePath = `${__dirname}/output.json`;

describe('Email reporter', () => {
  var unhook;
  var output = '';
  var mocha;
  
  before(() => {
    unhook = hookStdOut((string, encoding, fd) => {
      output += string;
    });
    
    mocha = new Mocha({
      timeout: 5000
    });

    mocha.addFile(`${__dirname}/mockTest.js`);
    
    try {
      fs.unlinkSync(jsonFilePath);      
    } catch (err) {
      console.log('file did not exist');
    }
  });
  
  after(() => {
    unhook();
    
    try {
      fs.unlinkSync(jsonFilePath);      
    } catch (err) {
      console.log('file did not exist');
    }
  });
  
  beforeEach(() => {
    ouput = '';
  });
  
  afterEach(() => {
  });
  
  // it('generates a string', (done) => {
  //   
  //   mocha.reporter(EmailReporter).run((failures) => {
  //     expect(failures).toEqual(1);
  //     expect(output).toBeA('string');
  //     
  //     done();
  //   });
  // });
  
  it('writes a file if json option is true', (done) => {
    
    mocha.reporter(EmailReporter, { json: jsonFilePath }).run((failures) => {
      expect(failures).toEqual(1);
      expect(output).toBeA('string');
      
      fs.stat(jsonFilePath, (err, stat) => {
        expect(err).toNotExist();
        
        expect(stat.isFile()).toEqual(true);
        
        var json = require(jsonFilePath);
        
        expect(json.suites['a test suite']['should pass this test'].pass).toEqual(true);
        expect(json.suites['a test suite']['should fail this test'].pass).toEqual(false);
        
        done();
      });
      
    });
  });
});
