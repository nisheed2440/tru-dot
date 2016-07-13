'use strict';

const electron = require('electron');
const dirTree = require('directory-tree');
const path = require('path');
// Module to control application life.
const { app } = electron;
// Module to create native browser window.
const { BrowserWindow } = electron;
//Ipc Main
const { ipcMain } = electron;

const usb = require('usb');

const globalShortcut = require('electron').globalShortcut;

const homePageKeys = require('./app/keys/homePageKeys');
const filesPageKeys = require('./app/keys/filesPageKeys');
const playerPageKeys = require('./app/keys/playerPageKeys');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;
var webContents = null;

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false
  });
  mainWindow.setMenu(null);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  webContents = mainWindow.webContents;

  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    webContents = null;
  });
});

ipcMain.on('home-keys', (event) => {
  homePageKeys(mainWindow);
  event.returnValue = true;
});

ipcMain.on('files-keys', (event) => {
  filesPageKeys(mainWindow);
  event.returnValue = true;
});

ipcMain.on('player-keys', (event) => {
  playerPageKeys(mainWindow);
  event.returnValue = true;
});

ipcMain.on('release-keys', (event) => {
  globalShortcut.unregisterAll();
  event.returnValue = true;
});

ipcMain.on('tru.directory', (event, filePath, fileTypes) => {
  var fullPath = path.join('D:/Projects/Pets/electron/IFE', filePath);
  var tree = dirTree(fullPath, fileTypes);
  event.returnValue = tree;
});


/*USB device detection and events*/
let brailleDevice = {
  idVendor: 1151,
  idProduct: 49189
};

//var brailleDevice = {
//  idVendor: 6421,
//  idProduct: 325
//};

usb.on('attach', function (device) {
  let deviceData = device.deviceDescriptor;
  if ((brailleDevice.idVendor === deviceData.idVendor) && (brailleDevice.idProduct === deviceData.idProduct)) {
    console.log('Braille device connected');
    webContents.send('device-attached', true);
  }
});

usb.on('detach', function (device) {
  let deviceData = device.deviceDescriptor;
  if ((brailleDevice.idVendor === deviceData.idVendor) && (brailleDevice.idProduct === deviceData.idProduct)) {
    console.log('Braille device disconnected');
    webContents.send('device-attached', false);
  }
});

