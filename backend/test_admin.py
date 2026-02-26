import urllib.request, urllib.parse, http.cookiejar, json

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Login via API
url = 'http://127.0.0.1:8000/api/auth/login/'
data = json.dumps({"username":"admin","password":"password"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
try:
    res = opener.open(req)
    print("API Login status:", res.status)
except Exception as e:
    print("API Login error:", e)
    if hasattr(e, 'read'):
        print(e.read().decode('utf-8'))

# Fetch Admin index
try:
    res2 = opener.open('http://127.0.0.1:8000/admin/')
    print("Admin status:", res2.status)
except Exception as e:
    print("Admin error:", e)
    if hasattr(e, 'read'):
        with open('admin_error.html', 'w', encoding='utf-8') as f:
            f.write(e.read().decode('utf-8', errors='ignore'))
        print("Saved admin_error.html")
