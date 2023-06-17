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
shake_data_filtered_df = shake_data_df[shake_data_df['Amount debited'] > 1]
shake_data_filtered_df = shake_data_filtered_df[['Amount debited', 'From / To','Date']]
shake_data_filtered_df=shake_data_filtered_df.dropna()
shake_data_filtered_df = shake_data_filtered_df[~shake_data_filtered_df["From / To"].isin(["MASSAGE ADDICT","guevarch@gmail.com","FREEDOM MOBILE", "yansunique@yahoo.ca", "CITY CENTRE BAPTIST", "GOOGLE YouTubePremium"])]
shake_data_filtered_df = shake_data_filtered_df.set_index('Amount debited')
shake_data_filtered_df.to_csv('resources/combined_summary.csv')
shake_data_filtered_df