import io
import os
from flask import Flask, send_file
from flask_cors import CORS

from db.DbConnector import DbConnector
from utils.utils import DB_NAME, create_zip_filename_from

app = Flask(__name__)
CORS(app)


@app.route('/files/<int:zip_id>')
def get_zip_file(zip_id):
    db_connector = DbConnector(DB_NAME)
    binary_zip_file = db_connector.get_zip_file(create_zip_filename_from(zip_id))
    db_connector.close_connection()
    return send_file(io.BytesIO(binary_zip_file[0]), mimetype="application/zip")


if __name__ == '__main__':
    app.run()
