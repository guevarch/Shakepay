import pandas as pd
import numpy as np
import pandas as pd
from datetime import datetime

try:

    df_list = []

    for i in range(1, 31):
        try:
            filename = f'resources/transactions_summary ({i}).csv'
            df = pd.read_csv(filename)
            df_list.append(df)
            print(f'Successfully loaded file {filename}')
            # Perform any data analysis or manipulation you need
        except FileNotFoundError:
            pass

    shake_data_df = pd.concat(df_list, ignore_index=True)
    shake_data_df['Date'] = pd.to_datetime(shake_data_df['Date']).dt.strftime('%Y-%m-%d')
    #Summary Spending
    summary_spending_df = shake_data_df[shake_data_df['Amount Debited'] > 1]
    summary_spending_df = summary_spending_df[['Amount Debited', 'Source / Destination','Date']]
    summary_spending_df=summary_spending_df.dropna()
    summary_spending_df = summary_spending_df[~summary_spending_df["Source / Destination"].isin(["MASSAGE ADDICT","guevarch@gmail.com","FREEDOM MOBILE", "yansunique@yahoo.ca", "CITY CENTRE BAPTIST", "GOOGLE YouTubePremium"])]
    df1 = pd.read_csv('resources/purchase_type_updated.csv')
    summary_spending_df = summary_spending_df.reset_index()
    summary_spending_df = summary_spending_df.merge(df1, on='Source / Destination', how='left')
    summary_spending_df.drop_duplicates(subset=['Date', 'Amount Debited','Source / Destination'], inplace=True)
    summary_spending_df = summary_spending_df.set_index('Amount Debited')
    summary_spending_df.drop('index', axis=1, inplace=True)

    # Check for NaN values
    if summary_spending_df.isnull().values.any():
        print("There are NaN values in the DataFrame.")

        # Find rows with missing values in the "Type" column
        mask = summary_spending_df['Type'].isnull()
        missing_rows = summary_spending_df[mask]

        # Loop through the missing rows and fill them in with user input
        for index, row in missing_rows.iterrows():
            source_dest = row['Source / Destination']
            value2 = input(f"Enter a value to fill NaNs for '{source_dest}': ")
            
            # Replace the missing value with the user input
            summary_spending_df.loc[summary_spending_df['Source / Destination'] == source_dest, 'Type'] = summary_spending_df.loc[summary_spending_df['Source / Destination'] == source_dest, 'Type'].replace(np.nan, value2)
            
            # Print out the subset of the DataFrame where 'Source / Destination' is equal to 'source_dest'
            subset_df = summary_spending_df[summary_spending_df['Source / Destination'] == source_dest]
            print(subset_df)

    else:
        print("There are no NaN values in the DataFrame.")
    
    # Save the DataFrame to a CSV file
    summary_spending_df.to_csv('resources/combined_summary.csv')
    # print(summary_spending_df.tail(10))

except FileNotFoundError:
    print("File not found. Please check the filename and path and try again.")


purchase_type_updated = pd.read_csv('resources/purchase_type_updated.csv')
# purchase_type_updated = purchase_type_updated.drop(['Date','Amount Debited','Unnamed: 0.1'], axis=1)
purchase_type_updated = purchase_type_updated.drop(['Unnamed: 0'], axis=1)
# purchase_type_updated = purchase_type_updated.drop(['Unnamed: 0.1'], axis=1)
purchase_type_updated.to_csv('resources/purchase_type_updated.csv')
purchase_type_updated