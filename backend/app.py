import io

from flask import Flask, send_file

from db.DbConnector import DbConnector
from utils.utils import DB_NAME, create_zip_filename_from

app = Flask(__name__)


@app.route('/<name>')
def hello(name):
    return f"Hello {name}"


@app.route('/test_db')
def test_db():
    db_connector = DbConnector(DB_NAME)
    test_id, name = db_connector.read_test_data()
    db_connector.close_connection()
    return f"id: {test_id}, name: {name}"


@app.route('/files/<int:zip_id>')
def get_zip_file(zip_id):
    db_connector = DbConnector(DB_NAME)
    binary_zip_file = db_connector.get_zip_file(create_zip_filename_from(zip_id))
    db_connector.close_connection()
    return send_file(io.BytesIO(binary_zip_file[0]), mimetype="application/zip")


if __name__ == '__main__':
    app.run()
