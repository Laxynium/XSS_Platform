import sqlite3
import os

from utils.utils import ZIP_FILES_TABLE_NAME


class DbConnector:
    def __init__(self, db_name):
        self.con = sqlite3.connect(os.path.abspath(os.path.dirname(__file__)) + '/../' + db_name)
        self.cur = self.con.cursor()

    def read_test_data(self):
        self.cur.execute("select * from tests")
        return self.cur.fetchone()

    def get_zip_file(self, file_name):
        print(file_name)
        self.cur.execute(f"select binary from {ZIP_FILES_TABLE_NAME} where filename LIKE '%{file_name}%'")
        return self.cur.fetchone()

    def close_connection(self):
        self.con.close()
