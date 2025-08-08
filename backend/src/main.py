import webview
from scripts import run_qq_invoice, run_visio2, ConifgVisio2
import sys
import json
from pathlib import Path


def root_path() -> Path:
    if hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).parent


root = root_path()

html_index = root / "f_dist" / "index.html"

# config = Config()
window = webview.create_window(
    title="Vue App",
    url=str(html_index),
    width=880,
    height=600,
)


@window.expose
def pyapi_qq_invoice(path: str):
    return run_qq_invoice(path)


@window.expose
def pyapi_visio2(path: str, js_callback: str):
    def callback(filename, idx, total_files):
        text = f"{idx}/{total_files} {filename}"
        window.evaluate_js(f"{js_callback}('{text}')")

    return run_visio2(ConifgVisio2(visio_dir=path, format="PDF"), callback)


@window.expose
def pyapi_test(data: dict, jsapi: str):
    window.evaluate_js(f"{jsapi}({json.dumps(data)})")
    print("pyapi_text")
    print(data)
    return data


def run_app():
    print(html_index.exists())
    webview.start()


if __name__ == "__main__":
    run_app()
