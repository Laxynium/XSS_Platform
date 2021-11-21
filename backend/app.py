from flask import Flask, make_response, send_file

from db.DbConnector import DbConnector
from utils.utils import DB_NAME
import io
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/files/<level_id>')
def get_files(level_id):
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "*")
    response.headers.add("Access-Control-Allow-Methods", "*")
    zip_path = os.path.abspath(os.path.dirname(__file__)) + '/files/level' + level_id + '.zip'
    with open(zip_path, 'rb') as fh:
        zip_file = io.BytesIO(fh.read())
    zip_file.seek(0)

    return send_file(zip_file, download_name='capsule.zip', as_attachment=True)


@app.route('/<name>')
def hello(name):
    return f"Hello {name}"


@app.route('/test_db')
def test_db():
    db_connector = DbConnector(DB_NAME)
    test_id, name = db_connector.read_test_data()
    return f"id: {test_id}, name: {name}"


if __name__ == '__main__':
    app.run()
