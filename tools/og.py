"""Build icons/og.png, the share card, from tools/og.html. Run: python3 tools/og.py [x]
x is where the card's view starts along the coast strip (default 0)."""
import http.server, socketserver, threading, functools, pathlib, sys
from playwright.sync_api import sync_playwright
ROOT = pathlib.Path(__file__).resolve().parent.parent
x = sys.argv[1] if len(sys.argv) > 1 else '0'
out = sys.argv[2] if len(sys.argv) > 2 else str(ROOT / 'icons' / 'og.png')
H = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
H.log_message = lambda *a: None
srv = socketserver.TCPServer(('127.0.0.1', 0), H); threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    chrome = '/usr/bin/google-chrome'
    b = p.chromium.launch(executable_path=chrome) if pathlib.Path(chrome).exists() else p.chromium.launch()
    pg = b.new_page(viewport={'width': 1200, 'height': 630})
    pg.goto(f'http://127.0.0.1:{srv.server_address[1]}/tools/og.html?x={x}')
    pg.wait_for_function("document.title === 'ready'"); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(300)
    pg.screenshot(path=out)
    b.close()
print('wrote', out)
