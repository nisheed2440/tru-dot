var globalShortcut = require('electron').globalShortcut;

function HomePageKeys(mainWindow) {
  globalShortcut.unregisterAll();

  globalShortcut.register('Up', function () {
    mainWindow.webContents.send('keypress', 'up');
  });

  globalShortcut.register('Down', function () {
    mainWindow.webContents.send('keypress', 'down');
  });

  globalShortcut.register('Space', function () {
    mainWindow.webContents.send('keypress', 'info');
  });

  globalShortcut.register('Enter', function () {
    mainWindow.webContents.send('keypress', 'select');
  });
}

module.exports = HomePageKeys;