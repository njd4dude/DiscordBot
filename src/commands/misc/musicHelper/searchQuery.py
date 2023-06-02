from youtube_search import YoutubeSearch
import json
import sys

results = YoutubeSearch(sys.argv[1], max_results=10).to_json()
json_str = json.loads(results)
url = json_str["videos"][0]["url_suffix"]
print(url)


