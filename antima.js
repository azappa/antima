#!/usr/bin/env node

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
var htmlPath = './' + template;
var templatePath = './' + template + '/template';


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

//  -- removing old HTML files --
del.sync([htmlPath + '/*.html']);

//  -- array for sitemap links --
var sitemap = [];
var sitemapConfig;

if (fs.existsSync(templatePath + '/sitemap.config.json')) {
  sitemapConfig = fs.readFileSync(templatePath + '/sitemap.config.json', 'utf-8');
  sitemapConfig = JSON.parse(sitemapConfig).keys;
}


//  -- generating sitemap --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);
  
  var sitemapItem = {
    path: htmlPath + '/' + file.replace('.yaml', '.html')
  };
  
  if (sitemapConfig) {
    sitemapConfig.forEach(function (k) {
      sitemapItem[k] = yamlSource[k];
    });
  }
  
  sitemap.push(sitemapItem);
});


//  -- writing sitemap into a jade file --
fs.writeFileSync(
  templatePath + '/sitemap.jade',
  '- var sitemap = ' + JSON.stringify(sitemap),
  'utf-8'
);


// -- build html pages from jade template --
yamls.forEach(function (file) {
  var yamlSource = yaml.load(yamlPath + '/' + file);
  var html = jade.renderFile(
    templatePath + '/' + template + '.jade', {
      data: yamlSource,
      fileName: file.replace('.yaml', '')
    }
  );

  fs.writeFileSync(
    htmlPath + '/' + file.replace('.yaml', '.html'),
    html,
    'utf-8'
  );
});

