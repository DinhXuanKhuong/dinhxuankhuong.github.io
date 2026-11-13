---
title: "Flight Delay and Cancellation Analysis"
date: 2026-01-10
description: "A team data science project exploring over one million 2024 U.S. flight records, with visual analysis of disruptions and baseline models for cancellations and delay duration."
category: Data analysis & predictive modeling
order: 3
repository: https://github.com/DinhXuanKhuong/Flight-Delay-And-Cancellation
draft: false
---
## Overview

This project investigates flight disruptions using a Kaggle dataset containing over one million U.S. flight records from 2024. The workflow combines data-quality checks, exploratory analysis, visualizations, and baseline predictive models in Jupyter notebooks.

## Questions explored

- How do cancellation rates and delays vary across origin airports, weekdays, and months?
- How do weather-related delays change over time?
- Are missing operational measurements associated with cancelled flights?
- How does flight volume vary across airports and calendar periods?
- How well can baseline models classify cancellations or estimate delay duration from the available features?

## Analysis and modeling

The final notebook removes duplicate records, converts date and time fields, examines missing values, and compares distributions and correlations. Bar charts, line plots, and heatmaps help make airport and temporal patterns easier to interpret.

Cancellation experiments compare logistic regression and random forests, with SMOTE used to address class imbalance. Delay-duration experiments compare linear regression, random forests, and XGBoost. The regression target combines recorded weather and late-aircraft delay minutes; it is not a measure of every possible source of delay.

These are historical-data experiments rather than a deployed flight-forecasting service.

## My role

I worked on exploratory data analysis and visualization and served as project lead. My work included distribution plots, correlation heatmaps, and coordinating the team’s analysis, as documented in the project summary.

## Built with

Python, pandas, NumPy, Matplotlib, Seaborn, SciPy, scikit-learn, imbalanced-learn, and XGBoost.

## Explore the analysis

- [Final analysis and modeling notebook](https://github.com/DinhXuanKhuong/Flight-Delay-And-Cancellation/blob/main/final_code.ipynb)
- [Project summary and individual contributions](https://github.com/DinhXuanKhuong/Flight-Delay-And-Cancellation/blob/main/projectSummary.md)
- [Dataset on Kaggle](https://www.kaggle.com/datasets/nalisha/flight-delay-and-cancellation-data-1-million-2024)
