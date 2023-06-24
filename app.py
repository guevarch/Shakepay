import pandas as pd
from datetime import datetime

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
summary_spending_df = summary_spending_df.set_index('Amount Debited')
summary_spending_df.to_csv('resources/combined_summary.csv')
summary_spending_df.tail(15)