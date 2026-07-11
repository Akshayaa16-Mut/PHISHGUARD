from phishing_predictor import analyze_url

test_urls = [
    "https://shop.example",
    "https://portal.example",
    "https://service.example",
    "https://my.example",
    "https://online.example",
    "https://user.example",
    "https://client.example",
    "https://access.example",
    "https://profile.example",
    "https://member.example",
    "https://portal.example/login",
    "https://service.example/account",
    "https://online.example/profile",
    "https://client.example/access",
    "https://my.example/user",
    "http://shop.example",
    "http://portal.example",
    "http://service.example",
    "https://my-portal.example",
    "https://online-service.example"
]

for url in test_urls:
    result = analyze_url(url)

    score = result["Phishing Risk Score"]

    print(
        url,
        "->",
        score,
        "%",
        result["Risk Level"]
    )

    if 30 <= score < 70:
        print(
            "\nMEDIUM RISK URL FOUND:",
            url
        )