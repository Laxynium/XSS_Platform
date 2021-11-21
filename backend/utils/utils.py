DB_NAME = "bsi.db"
TESTS_TABLE_NAME = "tests"
ZIP_FILES_TABLE_NAME = "zip_files"


def create_zip_filename_from(id):
    return f"level{id}.zip"
