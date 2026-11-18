"""Собирает прототип флоу Б в один HTML: base.css + extra.css + app.js → sdelka-flow-b.html"""
import sys
js=open('app.js').read(); css=open('base.css').read()+open('extra.css').read()
title=sys.argv[1] if len(sys.argv)>1 else 'Сделка.рф · Флоу Б'
head='<title>'+title+'</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap">\n<style>'
out=head+css+'</style>\n<div id="root"></div>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/htm@3.1.1/dist/htm.umd.js"></script>\n<script>\n'+js+'\n</script>\n'
open(sys.argv[2] if len(sys.argv)>2 else 'sdelka-flow-b.html','w').write(out)
