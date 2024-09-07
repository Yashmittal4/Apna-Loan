#!/usr/bin/env python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn import preprocessing
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

def preprocess_and_predict(file, user_input):
    dataset = pd.read_csv(file)

    x = dataset.drop("Receive/ Not receive credit", axis=1)
    y = dataset["Receive/ Not receive credit"]

    # Preprocessing
    cat_mask = x.dtypes == object
    cat_cols = x.columns[cat_mask].tolist()
    
    le = preprocessing.LabelEncoder()
    x[cat_cols] = x[cat_cols].apply(lambda col: le.fit_transform(col))

    # Split dataset
    xtrain, xtest, ytrain, ytest = train_test_split(x, y, test_size=0.3, stratify=y)

    # KNN model
    knn = KNeighborsClassifier(n_neighbors=10)
    knn.fit(xtrain, ytrain)
    pred_knn = knn.predict(xtest)
    
    # Random Forest
    forest = RandomForestClassifier(max_depth=2, random_state=0)
    forest.fit(xtrain, ytrain)
    pred_forest = forest.predict(xtest)
    
    # Logistic Regression
    log_regr = LogisticRegression(random_state=0, class_weight="balanced").fit(xtrain, ytrain)
    pred_log_reg = log_regr.predict(xtest)
    
    # SVM
    svm = SVC(gamma='auto', class_weight="balanced")
    svm.fit(xtrain, ytrain)
    pred_svm = svm.predict(xtest)
    
    # Print results (you can customize the output according to your needs)
    print("KNN Accuracy:", accuracy_score(ytest, pred_knn))
    print("Random Forest Accuracy:", accuracy_score(ytest, pred_forest))
    print("Logistic Regression Accuracy:", accuracy_score(ytest, pred_log_reg))
    print("SVM Accuracy:", accuracy_score(ytest, pred_svm))

# Example usage for running this app.py directly:
if __name__ == "__main__":
    # Assuming you have a dataset.csv file and some user input
    user_input = {
        "checking_account": "A11",
        "duration": 6,
        "credit_history": "A34",
        "purpose": "A43",
        "credit_amount": 1169,
        "employment": "A75"
    }
    preprocess_and_predict("dataset.csv", user_input)
