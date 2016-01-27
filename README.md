# mocha-email-reporter

---

## Intro

Mocha reporter which prints an email-friendly HTML string to stdout.

---

## Usage

### CLI

```mocha --reporter mocha-email-reporter test```

### Node

```
var Mocha = require('mocha');
var EmailReporter = require('mocha-email-reporter');

mocha = new Mocha();
mocha.addFile('testfile');
mocha.reporter(EmailReporter).run();
// or:
mocha.reporter(EmailReporter, { json: './path/to/outputFile.json' }).run();
```

---

## Options

### json
- (string) - Write a .json file to provided filepath in addition to printing the results to stdout
