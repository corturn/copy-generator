import sqlite3

# Create database with file name 'artists.db'

connect = sqlite3.connect('artists.db')

data = connect.cursor()

data.execute("""CREATE TABLE types (
           id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
           type_name TEXT);
           """)

connect.commit()

data.execute("""CREATE TABLE profiles (
           id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
           emoji TEXT,
           name TEXT,
           instagram TEXT,
           threads INTEGER,
           facebook TEXT,
           x TEXT,
           hashtags TEXT,
           type_id INTEGER,
           FOREIGN KEY (type_id) REFERENCES types(id));
           """)

connect.commit()

data.execute("""CREATE TABLE tags (
             id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
             general_tags TEXT);
           """)

connect.commit()

data.execute("""INSERT INTO tags(id)
             VALUES(1);;
           """)

connect.commit()

connect.close()
