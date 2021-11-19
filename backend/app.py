from flask import Flask

from db.DbConnector import DbConnector
from utils.utils import DB_NAME

app = Flask(__name__)


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
