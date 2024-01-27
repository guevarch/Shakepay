# Shakepay Spending Analysis Tool

## Overview
The Shakepay Spending Analysis tool is a Python and JavaScript-based application designed to process, clean, analyze, and visualize transaction data from CSV files. It provides insights into spending habits over a specified period.

### Features
- **CSV File Processing**: Reads multiple transaction statements, handling exceptions gracefully.
- **Data Cleaning**: Excludes irrelevant transactions and drops unnecessary columns.
- **Data Transformation**: Renames columns and formats dates for better readability.
- **Interactive Data Filtering**: Allows users to input date ranges and dynamically updates the results.
- **Data Visualization**: (Code commented out) Possibility to generate pie charts representing spending by category.
- **Web Interface**: Provides a user-friendly environment to input parameters and view tabulated results.

## Python Code Explanation

### Importing Required Libraries
```python
import pandas as pd
import numpy as np
```

### Reading Transaction Statements
- Iterates over 50 CSV files named `statement (i).csv` where `i` varies from 1 to 50.
- Skips the first row of each CSV considering it as a header.
- Counts successful file reads, outputting the number at the end.

### Data Cleaning Steps
- Filters out transactions with specific descriptions in the `exclude_strings`.
- Removes unwanted columns such as 'Item #', 'Card #', etc.
- Renames columns for clarity and converts date strings to formatted date objects.
- Reorders the columns and performs regex replacement on the location information.
- Merges additional data from `purchase_type_updated.csv`, aligning on the 'Source / Destination' field.
- Handles missing values (`NaN`) by prompting the user for replacements.

### Combining and Summarizing Data
- Reads a summary file, combines it with the newly cleaned data, filters out unnamed columns, removes duplicates, and sets an index.
- Saves the updated summary back to `combined_summary.csv`.

## JavaScript Code Explanation

### Initialization
- Once the DOM content is loaded, the script assigns an event listener to the "Generate Chart" button.

### Chart Generation Function
- Retrieves the start and end dates from user input fields.
- Parses the `combined_summary.csv` file using [Papa Parse](https://www.papaparse.com/).
- Filters and sorts the parsed data according to the specified date range.
- Groups the filtered data by 'Type' and calculates the sum of amounts debited per category.
- Populates a data table with filtered and sorted data.

### HTML Structure
- Provides input fields for the start and end dates and a "Generate Chart" button.
- Displays tables for filtered data and top expenses (layouts are provided but not filled with data in the given code).

### Notes:
For complete functionality, one should uncomment the relevant sections within the JavaScript code to enable chart generation, and ensure that all linked scripts and stylesheets are provided correctly within the project directory.