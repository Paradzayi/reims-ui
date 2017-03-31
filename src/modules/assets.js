var express = require('express');
var router = express.Router();
var path = require('path');
var assetsFolder = getAssetsFolder();

function getAssetsFolder() {
  return  __dirname.substring(0, __dirname.lastIndexOf('/')) + '/assets';
}
router.get('/css/semantic-ui.min.css', (req, res, next) => {

// define the path to get the semantic ui css
let semantic_ui_css_dir = path.join(assetsFolder, 'vendor/semantic-ui/css/semantic-ui.min.css');
res.sendFile(semantic_ui_css_dir);

})

router.get('/js/semantic-ui.min.js', (req, res, next) => {
  // define the path to get the semantic ui css
  let semantic_ui_js_dir = path.join(assetsFolder, 'vendor/semantic-ui/js/semantic-ui.min.js');
  res.sendFile(semantic_ui_js_dir);

})
module.exports = router;
