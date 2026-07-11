import json, urllib.request, xml.etree.ElementTree as ET

# News from BBC World RSS (no key, server-side fetch)
news = []
try:
    with urllib.request.urlopen('https://feeds.bbci.co.uk/news/world/rss.xml', timeout=15) as r:
        data = r.read()
    root = ET.fromstring(data)
    for item in root.iter('item'):
        title = item.findtext('title','')
        link = item.findtext('link','')
        if title: news.append({'title':title,'link':link})
except Exception as e:
    news = [{'title':'News fetch failed','link':''}]
with open('news.json','w') as f:
    json.dump(news[:6], f, indent=2)

# GitHub repos (no key for public user)
repos = []
try:
    with urllib.request.urlopen('https://api.github.com/users/chrisalunlloyd2-sudo/repos?per_page=100', timeout=15) as r:
        data = json.loads(r.read())
    for r in data:
        repos.append({'name':r['name'],'description':r.get('description'),'url':r['html_url'],'stars':r['stargazers_count'],'updated':r['updated_at']})
except Exception as e:
    repos = []
import random
random.shuffle(repos)
with open('repos.json','w') as f:
    json.dump(repos[:5], f, indent=2)
print('Wrote news.json and repos.json')
