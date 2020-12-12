import pandas as pd
from sklearn.model_selection import train_test_split

from services.globals import *


def remove_stopwords(text, stopwords):
    useful = [w for w in text if w not in stopwords]
    return useful


def getDoc(document):
    d = []
    for doc in document:
        d.append(getStem(doc))
    return d


def getStem(review):
    review = review.lower()
    tokens = tokenizer.tokenize(review)
    removed_stopwords = [w for w in tokens if w not in stop_words]
    stemmed_words = [ps.stem(token) for token in removed_stopwords]
    clean_review = ' '.join(stemmed_words)
    return clean_review


def check(content):
    df = pd.read_csv('df.csv')
    data = df.to_numpy()
    y = data[:, 1]
    X = data[:, 0]
    stemmed_doc = getDoc(X)
    cv = CountVectorizer()
    vc = cv.fit_transform(stemmed_doc)
    X = vc.toarray()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(cv.transform(getDoc([content])))
    print(y_pred)
    return y_pred
