// Self executing function to allow being called directly through command line
(function () {
  var fs = require('fs')
  var path = require('path')

  function removeBuildFromIgnore () {
    const filePath = path.join(__dirname, '..', '.gitignore')
    fs.readFile(filePath, 'utf8', function (err, data) {
      if (err) {
        return console.log(err)
      }
      fs.writeFile(filePath, data.replace(/build/g, ''), 'utf8', function (err) {
        if (err) return console.log(err)
        console.log('done baby')
      })
    })
  }
  module.exports = removeBuildFromIgnore

  // Check to see if being required by another module or not
  if (!module.parent) {
    removeBuildFromIgnore()
  }
})()
