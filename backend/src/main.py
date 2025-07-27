import webview
from pydantic_settings import BaseSettings

ENV_FILE_PATH = "../.env"

# 读取环境变量
class Config(BaseSettings):
    FRONTEND_DIST_PATH: str

    class Config:
        env_file = ENV_FILE_PATH
        env_file_encoding = "utf-8"

class Api:
    def greet(self, name):
        return f"Hello, {name} from Python!"


def run_app():
    config = Config()
    print(config.FRONTEND_DIST_PATH)
    api = Api()
    window = webview.create_window(
        title="Vue App",
        url=config.FRONTEND_DIST_PATH,
        width=800,
        height=600,
        js_api=api,
    )
    webview.start(debug=True)
    # webview.start()


if __name__ == "__main__":
    run_app()
