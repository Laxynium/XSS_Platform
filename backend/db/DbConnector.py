import sqlite3


class DbConnector:
    def __init__(self, db_name):
        self.con = sqlite3.connect(db_name)
        self.cur = self.con.cursor()

    def read_test_data(self):
        self.cur.execute("select * from tests")
        return self.cur.fetchone()
