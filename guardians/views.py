from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from sklearn.model_selection import train_test_split

from guardians.serializers import IndexSerializer


def index(request):
    return render(request, 'index.html')


class IndexApi(APIView):
    def post(self, request, *args, **kwargs):
        serializer = IndexSerializer(data=request.data)
        if serializer.is_valid():
            summary = generate_summary("text.txt")
            imp = check2(request.data)
            ans = {}
            ans["status"] = imp
            ans["summary"] = summary
            return Response(ans, status=status.HTTP_200_OK)
        return Response(serializer.errors, status.HTTP_400_BAD_REQUEST)


from nltk.stem import PorterStemmer
from nltk.tokenize import RegexpTokenizer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from nltk.cluster.util import cosine_distance
import networkx as nx
import numpy as np

tokenizer = RegexpTokenizer(r'\w+')
ps = PorterStemmer()
le = LabelEncoder()
model = MultinomialNB()
cv = CountVectorizer()

stop_words = ['to',
              'if',
              'which',
              'while',
              'in',
              'few',
              'their',
              'ourselves',
              'him',
              "isn't",
              "mightn't",
              "wouldn't",
              'our',
              'further',
              "doesn't",
              'after',
              'nor',
              'not',
              'so',
              'the',
              't',
              'what',
              'any',
              'more',
              "aren't",
              "didn't",
              'because',
              'has',
              "hadn't",
              'from',
              'have',
              'own',
              'how',
              'ain',
              'were',
              "mustn't",
              'they',
              'themselves',
              'we',
              'just',
              'of',
              'against',
              'won',
              'ours',
              'this',
              "shouldn't",
              'your',
              'then',
              'ma',
              'had',
              'myself',
              'each',
              'he',
              'only',
              "you'd",
              'these',
              "you've",
              'she',
              'haven',
              'here',
              'such',
              'do',
              'once',
              'o',
              'hasn',
              'you',
              'was',
              "wasn't",
              'some',
              's',
              'are',
              'is',
              "you're",
              'up',
              "hasn't",
              'can',
              'as',
              'y',
              'there',
              'same',
              'herself',
              'and',
              'all',
              "couldn't",
              'under',
              'with',
              'out',
              'those',
              'been',
              'before',
              'into',
              "you'll",
              'its',
              'who',
              'again',
              "should've",
              'but',
              'above',
              'it',
              'now',
              'most',
              'i',
              'down',
              'off',
              "that'll",
              'why',
              'doesn',
              'shouldn',
              'did',
              'between',
              'on',
              "weren't",
              'by',
              'below',
              'hadn',
              'isn',
              'didn',
              'through',
              'shan',
              "needn't",
              'needn',
              'them',
              'that',
              'weren',
              'very',
              'don',
              'for',
              'be',
              'aren',
              'her',
              're',
              'itself',
              'whom',
              'until',
              "it's",
              'doing',
              'no',
              'yours',
              've',
              "she's",
              'yourself',
              'having',
              'at',
              "haven't",
              'other',
              'his',
              'does',
              'will',
              'mightn',
              'yourselves',
              'both',
              'being',
              'wouldn',
              'theirs',
              'a',
              'himself',
              'd',
              'wasn',
              "won't",
              "shan't",
              'my',
              'about',
              'during',
              'than',
              'an',
              'hers',
              "don't",
              'over',
              'or',
              'me',
              'll',
              'am',
              'where',
              'couldn',
              'should',
              'too',
              'm',
              'mustn',
              'when']


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


def check2(content):
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


#############################3


def read_article(file_name):
    file = open(file_name, "r", encoding="utf8")
    file_data = file.readlines()
    str = ""
    doc = str.join(file_data)
    doc = doc.replace('\n', '. ')
    doc = doc.split(". ")
    sentences = []
    for sentence in doc:
        sentences.append(sentence.replace("[^a-zA-Z]", " ").split(" "))
    sentences.pop()

    return sentences


def build_similarity_matrix(sentences, stop_words):
    # Create an empty similarity matrix
    similarity_matrix = np.zeros((len(sentences), len(sentences)))
    for idx1 in range(len(sentences)):
        for idx2 in range(len(sentences)):
            if idx1 == idx2:  # ignore if both are same sentences
                continue
            similarity_matrix[idx1][idx2] = sentence_similarity(sentences[idx1], sentences[idx2], stop_words)
    return similarity_matrix


def sentence_similarity(sent1, sent2, stopwords=None):
    if stopwords is None:
        stopwords = []

    sent1 = [w.lower() for w in sent1]
    sent2 = [w.lower() for w in sent2]

    all_words = list(set(sent1 + sent2))

    vector1 = [0] * len(all_words)
    vector2 = [0] * len(all_words)

    # build the vector for the first sentence
    for w in sent1:
        if w in stopwords:
            continue
        vector1[all_words.index(w)] += 1

    # build the vector for the second sentence
    for w in sent2:
        if w in stopwords:
            continue
        vector2[all_words.index(w)] += 1

    return 1 - cosine_distance(vector1, vector2)


def generate_summary(file_name, top_n=5):
    summarize_text = []
    # Step 1 - Read text anc split it
    sentences = read_article(file_name)
    # Step 2 - Generate Similary Martix across sentences
    sentence_similarity_martix = build_similarity_matrix(sentences, stop_words)
    # Step 3 - Rank sentences in similarity martix
    sentence_similarity_graph = nx.from_numpy_array(sentence_similarity_martix)
    scores = nx.pagerank(sentence_similarity_graph)

    # Step 4 - Sort the rank and pick top sentences
    ranked_sentence = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)
    print("Indexes of top ranked_sentence order are ", ranked_sentence)

    for i in range(top_n):
        summarize_text.append(" ".join(ranked_sentence[i][1]))

    # Step 5 - Offcourse, output the summarize texr
    print("Summarize Text: \n", ". ".join(summarize_text))

    return ". ".join(summarize_text)
