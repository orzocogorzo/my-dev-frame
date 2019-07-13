__all__ = ["app"]

# BUILT IN
from os import getenv
from os.path import join, isfile

# VENDOR
from flask import Flask, send_file, abort, request, redirect

app = Flask(__name__)
app.config["MONGO_URI"] = getenv("MONGODB_URI")
app.config["STATICS"] = getenv("STATICS_DIR")
app.config["PORT"] = getenv("PORT")


@app.route('/', methods=["GET"], defaults={"path": "index.html"})
@app.route('/<path:path>', methods=["GET"])
def index (path):
    path = join(app.config["STATICS"], path)

    if isfile(path):
        return send_file(path)
    else:
        abort(404)


@app.route('/login', methods=["POST"])
def login ():
    credentials = request.json.get("credentials")
    print(credentials)