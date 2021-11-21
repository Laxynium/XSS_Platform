import os
import sqlite3

from utils.utils import DB_NAME, TESTS_TABLE_NAME, ZIP_FILES_TABLE_NAME


def create_tables(cur):
    cur.execute(f"DROP TABLE IF EXISTS {TESTS_TABLE_NAME}")
    cur.execute(f"DROP TABLE IF EXISTS {ZIP_FILES_TABLE_NAME}")

    cur.execute(f"CREATE TABLE {TESTS_TABLE_NAME} (id integer, name text)")
    cur.execute(f"CREATE TABLE {ZIP_FILES_TABLE_NAME} (filename text, binary blob)")


def insert_into_test_table(cur, test_id, name):
    cur.execute(f"INSERT INTO {TESTS_TABLE_NAME} VALUES ({test_id}, '{name}')")


def insert_into_zip_files_table(cur, file_name):
    f = open(file_name, "rb")
    cur.execute(f"INSERT INTO {ZIP_FILES_TABLE_NAME} VALUES(?, ?)", (file_name, sqlite3.Binary(f.read())))


def initiate_db():
    con = sqlite3.connect(DB_NAME)
    cur = con.cursor()
    create_tables(cur)

    insert_into_test_table(cur, 1, 'test_name')
    zip_path = os.path.abspath(os.path.dirname(__file__)) + '/files/level1.zip'
    insert_into_zip_files_table(cur, zip_path)

    con.commit()
    con.close()


initiate_db()
