#!/usr/bin/env node

//  -- node modules --
const fs = require('fs');
const del = require('del');
const pug = require('pug');
const { argv } = require('yargs');
const yaml = require('yamljs');

//  -- check parameters --
if (!argv.template || argv.template === '') {
  console.log('Error, you must pass a --template variable to node process.');
  process.exit(1);
}

//  -- variables --
const { template } = argv;
const yamlPath = `./${template}/source`;
const htmlPath = `./${template}`;
const templatePath = `./${template}/template`;

//  -- check if folder with json files exists --
if (!fs.existsSync(yamlPath)) {
  console.log('Error, json folder does not exist.');
  process.exit(1);
}

//  -- reading data from json files --
let yamls = fs.readdirSync(yamlPath);
if (!yamls || yamls.length === 0) {
  console.log('Error, you have zero json files for data loading.');
  process.exit(1);
}

//  -- removing old HTML files --
del.sync([`${htmlPath}/*.html`]);

//  -- array for sitemap links --
const sitemap = [];
let sitemapConfig;

if (fs.existsSync(`${templatePath}/sitemap.config.json`)) {
  sitemapConfig = fs.readFileSync(
    `${templatePath}/sitemap.config.json`,
    'utf-8'
  );
  sitemapConfig = JSON.parse(sitemapConfig).keys;
}

//  -- generating sitemap --
yamls = yamls.filter((y) => {
  return y.indexOf('.yaml') !== -1;
});
yamls.forEach((file) => {
  const yamlSource = yaml.load(`${yamlPath}/${file}`);
  const sitemapItem = {
    path: `${htmlPath}/${file.replace('.yaml', '.html')}`,
    relativePath: `./${file.replace('.yaml', '.html')}`,
    fileName: `${file.replace('.yaml', '.html')}`,
  };

  if (sitemapConfig) {
    sitemapConfig.forEach((k) => {
      sitemapItem[k] = yamlSource[k];
    });
  }

  sitemap.push(sitemapItem);
});

//  -- writing sitemap into a pug file --
fs.writeFileSync(
  `${templatePath}/sitemap.pug`,
  `- var sitemap = ${JSON.stringify(sitemap)}`,
  'utf-8'
);

// -- build html pages from pug template --
yamls.forEach((file) => {
  const yamlSource = yaml.load(`${yamlPath}/${file}`);
  const html = pug.renderFile(`${templatePath}/${template}.pug`, {
    data: yamlSource,
    fileName: file.replace('.yaml', ''),
  });

  fs.writeFileSync(
    `${htmlPath}/${file.replace('.yaml', '.html')}`,
    html,
    'utf-8'
  );
});
