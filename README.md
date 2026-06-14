# 🧪 Data Science Project 1 — Advanced EDA & Feature Engineering

**DecodeLabs Industrial Training Kit | Batch 2026**

---

## 📋 Project Overview

This project demonstrates professional-grade exploratory data analysis (EDA), data cleaning, and feature engineering on an **E-Commerce Orders Dataset**. The objective is to transform raw, chaotic data into a mathematically clean dataset ready for machine learning algorithms.

**Key Metrics:**
- **Dataset Size:** 1,200 rows × 14 columns
- **Date Range:** Full e-commerce transaction history
- **Framework:** Input → Process → Output (IPO) Architecture

> *"Data preprocessing is not janitorial work; it is the structural engineering of mathematical truth."* — DecodeLabs Project 1 Kit

---

## 📂 Project Structure

```
Project1/
├── README.md                                          # This file
├── DS_Project1_Advanced_EDA_Feature_Engineering.ipynb # Main analysis notebook
├── Dataset for Data Analytics.xlsx                    # Raw input data
└── Cleaned_Datasets_AfterAnalysis/
    ├── Cleaned_Dataset_Project1.csv                   # Phase 1 output (cleaned)
    └── Phase2_Encoded_Scaled_Dataset.csv              # Phase 2 output (encoded & scaled)
```

---

## 🔄 Project Phases

### Phase 1 — INPUT (Data Cleaning & Preparation)
**Objectives:**
- Missing Value Imputation using statistical decision matrix
- Outlier Detection and Neutralization via Interquartile Range (IQR) method
- Data validation and quality assurance

**Missing Data Strategy:**
| Missingness % | Strategy |
|---|---|
| **< 5%** | Drop rows — preserves data volume, prevents synthetic bias |
| **5% – 20%** | Statistical Imputation — Median or conditional sub-group estimation |
| **> 20%** | K-Nearest Neighbours (KNN) multi-dimensional estimation |

**Outlier Handling:**
- IQR Method: Q1 - 1.5×IQR to Q3 + 1.5×IQR
- Outliers neutralized (capped) rather than removed to preserve data volume

**Output:** `Cleaned_Datasets_AfterAnalysis/Cleaned_Dataset_Project1.csv`

### Phase 2 — Feature Engineering
**Engineered Features (5 new predictive variables):**
- Vectorized feature transformations using NumPy/Pandas
- Domain-specific feature creation from temporal and categorical data
- Encoding of categorical variables
- Feature scaling (standardization/normalization)

**Output:** `Cleaned_Datasets_AfterAnalysis/Phase2_Encoded_Scaled_Dataset.csv`

---

## 🛠 Technologies & Libraries

| Category | Tools |
|---|---|
| **Data Processing** | Pandas, NumPy |
| **Visualization** | Matplotlib, Seaborn |
| **Analysis** | Scipy, Scikit-learn (for scaling) |
| **Environment** | Python 3.x, Jupyter Notebook |

---

## 📊 Key Analyses Performed

1. **Initial Data Audit**
   - Shape, data types, and schema validation
   - Unique value counts per column

2. **Missing Data Analysis**
   - Percentage calculation per feature
   - Strategy assignment based on missingness threshold

3. **Outlier Detection**
   - IQR-based identification and visualization
   - Statistical summary before/after treatment

4. **Distribution Analysis**
   - Univariate analysis (histograms, box plots)
   - Correlation matrix heatmap
   - Skewness and kurtosis assessment

5. **Feature Engineering**
   - Temporal feature extraction
   - Categorical encoding (one-hot, label encoding)
   - Scaling and normalization

---

## 🚀 How to Use

### 1. Run the Analysis
```bash
# Open Jupyter Notebook
jupyter notebook DS_Project1_Advanced_EDA_Feature_Engineering.ipynb
```

### 2. Execute Cells Sequentially
- **Step 0:** Library Imports
- **Step 1:** Load & Inspect Raw Dataset
- **Step 2:** Missing Data Analysis
- **Step 3:** Data Cleaning & Imputation
- **Step 4:** Outlier Detection & Treatment
- **Step 5:** Exploratory Data Analysis (EDA)
- **Step 6:** Feature Engineering
- **Step 7:** Export Cleaned & Processed Data

### 3. Access Output Files
- **For cleaned data:** Use `Cleaned_Datasets_AfterAnalysis/Cleaned_Dataset_Project1.csv`
- **For ML-ready data:** Use `Cleaned_Datasets_AfterAnalysis/Phase2_Encoded_Scaled_Dataset.csv`

---

## 📈 Expected Outcomes

✅ **Data Quality Improvements:**
- Zero missing values in final dataset
- Outliers treated appropriately
- Consistent data types across all columns

✅ **Feature Readiness:**
- All categorical variables encoded
- All numeric features scaled
- New predictive features engineered

✅ **Deliverables:**
- Clean, production-ready dataset
- Comprehensive data quality report
- Reproducible preprocessing pipeline

---

## 📝 Notes

- All transformations are **reversible** — raw data is preserved
- Missing value strategy is data-driven, not arbitrary
- Feature engineering focuses on **interpretability and predictive power**
- Visualizations aid in **decision justification**

---

## 👥 Project Info

- **Training Kit:** DecodeLabs Internship Program
- **Batch:** 2026
- **Dataset Type:** E-Commerce (Real-world scenario)
- **Complexity Level:** Intermediate to Advanced

---

## 📚 References

- Pandas Documentation: https://pandas.pydata.org/docs/
- Scikit-learn Preprocessing: https://scikit-learn.org/stable/modules/preprocessing.html
- Data Cleaning Best Practices: https://www.kaggle.com/docs/datasets

---

**Last Updated:** 2026-06-14
