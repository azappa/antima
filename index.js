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
var _template = argv.template;
var yamlPath = './' + _template + '-source';
var htmlDir = './' + _template;
var templateDir = './_templates';


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
var _sitemap = [];


//  -- generating sitemap --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);

  _sitemap.push({
    path: file.replace('.yaml', '.html'),
    title: yamlSource.title 
  });
});


//  -- writing sitemap into a jade file --
fs.writeFileSync(
  './_templates/' + _template + '-sitemap.jade',
  '- var sitemap = ' + JSON.stringify(_sitemap),
  'utf-8'
);


// -- build html pages from jade template --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);
  var html = jade.renderFile(
    templateDir + '/' + _template + '.jade', {
      data: yamlSource
    }
  );

  fs.writeFileSync(
    htmlDir + '/' + file.replace('.yaml', '.html'),
    html,
    'utf-8'
  );
});

