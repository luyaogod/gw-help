pyinstaller --onefile --add-data "src/f_dist:f_dist" src/main.py

pyinstaller --onefile --noconsole --add-data "src/f_dist:f_dist" src/main.py