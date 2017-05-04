var express = require('express');
var router = express.Router();
var path = require('path');
var assetsFolder = getAssetsFolder();

function getAssetsFolder() {
  return  __dirname.substring(0, __dirname.lastIndexOf('/')) + '/assets';
}
router.get('/css/semantic-ui.min.css', (req, res, next) => {

// define the path to get the semantic ui css
let semantic_ui_css_dir = path.join(assetsFolder, 'vendor/semantic-ui/semantic-ui.min.css');
res.sendFile(semantic_ui_css_dir);

})

router.get('/js/semantic-ui.min.js', (req, res, next) => {
  // define the path to get the semantic ui css
  let semantic_ui_js_dir = path.join(assetsFolder, 'vendor/semantic-ui/semantic-ui.min.js');
  res.sendFile(semantic_ui_js_dir);

})

router.get('/js/jquery-2.2.3.min.js', (req, res, next) => {
  // define the path to get the semantic ui css
  let jquery_dir = path.join(assetsFolder, 'vendor/jQuery/jquery-2.2.3.min.js');
  res.sendFile(jquery_dir);

})

router.get('/css/themes/default/assets/fonts/icons.ttf', (req, res, next) => {
  // define the path to get the semantic ui css
  let icons_ttf_dir = path.join(assetsFolder, 'vendor/semantic-ui/themes/default/assets/fonts/icons.ttf');
  res.sendFile(icons_ttf_dir);

})

router.get('/css/themes/default/assets/fonts/icons.woff', (req, res, next) => {
  // define the path to get the semantic ui css
  let icons_woff_dir = path.join(assetsFolder, 'vendor/semantic-ui/themes/default/assets/fonts/icons.woff');
  res.sendFile(icons_woff_dir);

})

module.exports = router;
