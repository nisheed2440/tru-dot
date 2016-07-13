var globalShortcut = require('electron').globalShortcut;

function HomePageKeys(mainWindow) {
  globalShortcut.unregisterAll();

  globalShortcut.register('U', function () {
    mainWindow.webContents.send('keypress', 'volUp');
  });

  globalShortcut.register('D', function () {
    mainWindow.webContents.send('keypress', 'volDown');
  });

  globalShortcut.register('P', function () {
    mainWindow.webContents.send('keypress', 'playPause');
  });

  globalShortcut.register('Escape', function () {
    mainWindow.webContents.send('keypress', 'back');
  });
}

module.exports = HomePageKeys;