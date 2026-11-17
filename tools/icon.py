"""Build the app icons in icons/ from tools/icon.html. Run: python3 tools/icon.py"""
import http.server, socketserver, threading, functools, pathlib
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)); H.log_message = lambda *a: None
srv = socketserver.TCPServer(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    for name, size, extra in [('icon-192', 192, ''), ('icon-512', 512, ''), ('icon-maskable-512', 512, '&maskable=1'), ('icon-180', 180, '')]:
        pg = b.new_page(viewport={'width': size, 'height': size})
        pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/tools/icon.html?size={size}{extra}'); pg.wait_for_function("document.title === 'ready'")
        pg.screenshot(path=str(ROOT / 'icons' / f'{name}.png')); pg.close()
    b.close()
print('wrote icons')
