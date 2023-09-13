from flask import Flask, render_template, request, jsonify, session
import sqlite3
import re
import smartypants
from flask_session import Session

app = Flask(__name__)

#app.secret_key = "corysillykey"

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.route("/", methods=["GET", "POST"])
def index():
    if (request.method == "POST"):
        caption = request.form.get("caption")
        session["caption"] = caption
        copy = copygenerate(caption)
        success = 1
        return jsonify(success=success, copy=copy)
    else:
        return render_template("index.html", caption=session.get("caption"))

@app.route("/database")
def database():
    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    rows = con.execute("""SELECT profiles.id, emoji, name, instagram, threads, facebook, x, hashtags, typename
                      FROM profiles
                      INNER JOIN types
                      ON profiles.type_id = types.id ORDER BY type_id;
                      """).fetchall()
    
    types = con.execute("""SELECT typename
                        FROM types;""").fetchall()
    
    con.close()
    
    return render_template("database.html", rows=rows, types=types)

@app.route("/other", methods=["GET", "POST"])
def other():
    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    tags = con.execute("""SELECT general_tags
                       FROM tags
                       WHERE id = 1;""").fetchone()['general_tags']

    if request.method == "POST":
        if request.form.get('type') == 'tags':
            try:
                newtags = request.form.get('tags')
                con.execute("UPDATE tags SET general_tags = ? WHERE id = 1", (newtags,))

                con.commit()
                success = 1

                return jsonify(success)
            except Exception as e:
                print(e)
            finally:
                con.close()
    else:
        
        return render_template('other.html', tags=tags)
    
@app.route("/update", methods=["POST"])
def update():
    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    field = request.form.get("field")
    value = request.form.get("value")
    id = request.form.get("id")

    #print(f"Received field: {field}, value: {value}, id: {id}, ")

    try:
        if field == "typename":
            con.execute("""UPDATE profiles
                        SET type_id =
                        (SELECT types.id
                        FROM types
                        WHERE typename = ?)
                        WHERE id = ?;""", (value, id))
            con.commit()

            success = 1

            return jsonify(success)
        elif field in ["emoji", "name", "instagram", "threads", "facebook", "x", "hashtags"]:

            query = f"UPDATE profiles SET {field} = ? WHERE id = ?;"
            con.execute(query, (value, id))
            con.commit()

            success = 1

            return jsonify(success)
    except Exception as e:
        print(e)
    finally:
        con.close()

@app.route("/delete", methods=["POST"])
def delete():
    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    id = request.form.get("id")

    #print(f"{id} test")
    
    try:
        con.execute("DELETE FROM profiles WHERE id = ?", (id,))

        con.commit()
        success = 1

        return jsonify(success)
    except Exception as e:
        print(e)
    finally:
        con.close()

@app.route("/newrow", methods=["POST"])
def newrow():
    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    typename = request.form.get("typename")
    emoji = request.form.get("emoji")
    name = request.form.get("name")
    instagram = request.form.get("instagram")
    threadstext = request.form.get("threads")
    threads = 0

    if (threadstext == "on"):
        threads = 1

    facebook = request.form.get("facebook")
    x = request.form.get("x")
    hashtags = request.form.get("hashtags")
    #hashtagsformat = "#" + " #".join(hashtags.split(" ")).lower()
    #print(hashtagsformat)


    try:
        othertypes = [type["typename"] for type in con.execute("""SELECT typename
                    FROM types
                    WHERE typename
                    IS NOT ?""", (typename,)).fetchall()]
        
        con.execute("""INSERT INTO profiles(emoji, name, instagram, threads, facebook, x, hashtags, type_id)
                    VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT types.id FROM types WHERE typename = ?));""", (emoji, name, instagram, threads, facebook, x, hashtags, typename))
        
        con.commit()

        id = con.execute("SELECT last_insert_rowid()").fetchone()[0]
        
        success = 1

        return jsonify(success=success, id=id, othertypes=othertypes)
    except Exception as e:
        print(e)
    finally:
        con.close()


def copygenerate(caption):
    caption = smartypants.smartypants(caption)
    captionIG = caption
    captionTH = caption
    captionFB = caption
    captionTW = caption
    captiongroup = {'instagram':captionIG, 'threads':captionTH, 'facebook':captionFB, 'x':captionTW}
    artisttag = ''
    hashtags = ''
    emoji = set()

    con = sqlite3.connect('artists.db')

    con.row_factory = sqlite3.Row

    rows = con.execute("""SELECT profiles.id, emoji, name, instagram, threads, facebook, x, hashtags, typename
                    FROM profiles
                    INNER JOIN types
                    ON profiles.type_id = types.id ORDER BY type_id;
                    """)
    
    generaltags = con.execute("""SELECT general_tags
                       FROM tags
                       WHERE id = 1;""").fetchone()['general_tags']
    

    for row in rows:
        artistname = row['name']
        artistnamere = re.compile(row['name'], re.I)
        if artistname.lower() in caption.lower():
            for key in captiongroup:
                if row[key] not in ['', 0]:
                    if row[key] == 1:
                        pass
                    elif row[key][0] == '%':
                        artisttag = artistname + ' @' + row[key][1:]
                    else:
                        artisttag = '@' + row[key]

                    captiongroup[key] = re.sub(artistnamere, artisttag, captiongroup[key])
                else:
                    captiongroup[key] = re.sub(artistnamere, artistname, captiongroup[key])

            hashtags += row['hashtags'] + ' '

            if row['emoji']:
                emoji.add(row['emoji'])

    if captiongroup['x'][0] == '@':
        if len(emoji) == 1:
            captiongroup['x'] = ''.join(emoji) + ' ' + captiongroup['x']
        else:
            captiongroup['x'] = '🎶 ' + captiongroup['x']


    hashtags += generaltags

    hashtagslist = hashtags.split(' ')
    hashtags = ' '.join(removedupe(hashtagslist))

    print(captiongroup["instagram"])

    finishedcaptioncode = f'IG:\n{captiongroup["instagram"]}\n\nTH:\n{captiongroup["threads"]}\n\nFB:\n{captiongroup["facebook"]}\n\nX:\n{captiongroup["x"]}\n\nHashtags:\n{hashtags}'
    return finishedcaptioncode

def removedupe(seq):
    seen = set()
    seen_add = seen.add
    return [x for x in seq if not (x in seen or seen_add(x))]