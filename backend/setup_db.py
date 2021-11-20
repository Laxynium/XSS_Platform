import sqlite3


def create_test_table(cur):
    cur.execute("CREATE TABLE tests (id integer, name text)")


def insert_into_test_table(cur, test_id, name):
    cur.execute(f"INSERT INTO tests VALUES ({test_id}, '{name}')")


def initiate_db():
    con = sqlite3.connect('bsi.db')
    cur = con.cursor()
    create_test_table(cur)
    insert_into_test_table(cur, 1, 'test_name')
    con.commit()
    con.close()


initiate_db()
