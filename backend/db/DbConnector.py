import sqlite3


class DbConnector:
    def __init__(self, db_name):
        self.con = sqlite3.connect(db_name)
        self.cur = self.con.cursor()

    def read_test_data(self):
        self.cur.execute("select * from tests")
        return self.cur.fetchone()

    def get_zip_file(self, file_name):
        self.cur.execute("select binary from zip_tests where filename = ?", (file_name,))
        return self.cur.fetchone()

    def close_connection(self):
        self.con.close()
