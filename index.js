/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false */
'use strict';


//  -- node modules --
var fs = require('fs');
var del = require('del');
var jade = require('jade');
var argv = require('yargs').argv;
var yaml = require('yamljs');


//  -- check parameters --
if (!argv.template || argv.template === '') {
  console.log('Error, you must pass a --template variable to node process.');
  process.exit(1);
  return;
}


//  -- variables --
var template = argv.template;
var yamlPath = './' + template + '/source';
var htmlDir = './' + template;
var templateDir = './' + template + '/template';


//  -- check if folder with json files exists --
if (!fs.existsSync(yamlPath)) {
  console.log('Error, json folder does not exist.');
  process.exit(1);
  return;
}


//  -- reading data from json files --
var yamls = fs.readdirSync(yamlPath);
if (!yamls || yamls.length === 0) {
  console.log('Error, you have zero json files for data loading.');
  process.exit(1);
  return;
}


//  -- removing and recreating folders --
del.sync([htmlDir]);
fs.mkdirSync(htmlDir);


//  -- array for sitemap links --
var sitemap = [];


//  -- generating sitemap --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);

  sitemap.push({
    path: htmlDir + '/' + file.replace('.yaml', '.html'),
    title: yamlSource.title 
  });
});


//  -- writing sitemap into a jade file --
fs.writeFileSync(
  templateDir + '/sitemap.jade',
  '- var sitemap = ' + JSON.stringify(sitemap),
  'utf-8'
);


// -- build html pages from jade template --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);
  var html = jade.renderFile(
    templateDir + '/' + template + '.jade', {
      data: yamlSource
    }
  );

  fs.writeFileSync(
    htmlDir + '/' + file.replace('.yaml', '.html'),
    html,
    'utf-8'
  );
});

