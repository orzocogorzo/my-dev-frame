# VENDOR
from sys import argv
from os import environ, getcwd, getenv
from os.path import join

environ["STATICS_DIR"] = join(getcwd(), 'server/statics')
environ["PORT"] = getenv("PORT", "5000")

if "--dev" in argv:
    environ["MONGODB_URI"] = "mongodb://localhost:27017/moai"
    debug = True
else:
    if not getenv("MONGODB_URI"):
        environ["MONGODB_URI"] = "mongodb://orzo:Contrasenya1992_@localhost:27017/moai"

    debug = False

# APP
from server import application

if __name__ == '__main__':
    application.run(debug=debug, port=environ["PORT"])
