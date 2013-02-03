var casper = require('casper').create();
var system = require('system');

if (system.args.length < 4) {
  console.info("usage: casperjs linkedin.js jspath");
  phantom.exit();
}

// keywords is the keyword to search for (EPIC)
// postalcode is the postal code to narrow results for (97005)
// industry is the name of the industry (Hospital & Health Care)
var keywords = system.env['KEYWORDS'];
var postalcode = system.env['POSTALCODE'];
var industry = system.env['INDUSTRY'];
var jsPath = system.args[4];

var linkedin_user = system.env['LINKEDIN_USER'];
var linkedin_password = system.env['LINKEDIN_PASSWORD'];
var debug = system.env['DEBUG'];

if (!linkedin_user) {
  console.info("Missing LINKEDIN_USER env variable");
}

if (!linkedin_password) {
  console.info("Missing LINKEDIN_PASSWORD env variable");
}

if ((!linkedin_user) || (!linkedin_password)) {
  phantom.exit();
}

if (debug) {
  console.info('keywords', keywords);
  console.info('postalcode', postalcode);
  console.info('industry', industry);
  console.info('js path', jsPath);
  console.info('LinkedIn user', linkedin_user);
}

casper.options.clientScripts = [jsPath + "/jquery.min.js"];

// performs login on LinkedIn page
casper.start('http://www.linkedin.com', function() {
  if (debug) { console.info("Logging in..."); }
  this.fill('form[name=login]', {
    session_key: linkedin_user,
    session_password: linkedin_password
  }, true);
});

// clicks Advanced people search
casper.then(function() {
  if (debug) { console.info("Clicking advanced link..."); }
  this.clickLabel('Advanced', 'a');
});

// clicks on the selected industry and submits the
// forms with proper attributes
casper.then(function() {
  if (debug) { console.info("Submitting search..."); }
  this.clickLabel(industry, 'label');
  this.fill('form[name=search]', {
    keywords:    keywords,
    postalCode:  postalcode,
    countryCode: 'us',
    distance:    '10'
  }, true);
});

casper.then(function() {
  if (debug) { console.info("Retrieving top companies..."); }
  var companies = this.evaluate(function() {
    var titles = [];
    $('#facet-CC ul li label').each(function(index) {
      var count = $('span.count', this).text();
      var title = $(this).attr('title');

      titles.push({ title: title, count: count });
    });
    return titles;
  });

  var filteredCompanies = []
  for (var i = 0; i < companies.length; i++) {
    c = companies[i];

    var matches;
    if (matches = c.count.match(/(\d+)/)) {
      count = matches[1];
      filteredCompanies.push({ title: c.title, count: count });
    }
    else {
      count = "-";
    }
  }

  require('utils').dump(filteredCompanies);
});

casper.run();
