const { app, BrowserWindow, Menu } = require('electron')

function createWindow () {
  // Cria uma janela de navegação.
  let win = new BrowserWindow({
    title:"Cashback",
    titleBarOverlay: true,
    width: 400,
    height: 700,
    x: 0,
    y: 0,
    useContentSize: true,
    webPreferences: {
      nodeIntegration: false // Impede o acesso ao Node.js no seu website
    }
  })
  Menu.setApplicationMenu(null)
  // Carrega o arquivo index.html do seu website.
  win.loadURL('http://localhost:3000')
}

// Este método será chamado quando o Electron terminar de inicializar e estiver pronto para criar janelas de navegação.
app.whenReady().then(createWindow)