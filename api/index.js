import { GuiServer } from '../src/gui/gui-server.js';

const guiServer = new GuiServer();

export default async function handler(req, res) {
  // Initialize the server if not already done
  if (!guiServer.initialized) {
    await guiServer.initialize();
    guiServer.initialized = true;
  }

  // Handle the request
  return guiServer.app(req, res);
}