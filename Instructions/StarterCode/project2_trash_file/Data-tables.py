#!/usr/bin/env python
# coding: utf-8

# In[1]:


# Dependencies and Setup
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import requests
import time
from scipy.stats import linregress


# In[2]:


# Starting URL for Covid-19 API Call
base_url = "https://api.covid19api.com/summary"

base_url


# In[3]:


data = requests.get(base_url).json()


# In[4]:


r = requests.get('https://api.covid19api.com/summary')
x = r.json()
df = pd.DataFrame(x['Countries'])
print(df.head())


# In[5]:


sorted_df = df.sort_values(by='TotalConfirmed', ascending=False)
sorted_df.head(10)


# In[6]:


#html = sorted_df.to_html()
#text_file = open("index.html", "w")
#text_file.write(html)
#text_file.close()


# In[7]:


clean_df = sorted_df.drop(columns=['Date', 'Premium', 'Slug', 'CountryCode']).reset_index()
new_df= clean_df.drop(['index'], axis = 1)
new_df.head(10)


# In[8]:


df1 = new_df.head(10)
df1


# In[16]:


import seaborn as sns
plt.subplots(figsize=(50,15))
number_cases = df1.NewConfirmed.values
country_name = df1.Country.values
number_cases
country_name
ax = sns.barplot(x=number_cases , y=country_name)
ax.set_title('Total deaths', color='red', alpha=0.5, size=20)

ax.set_ylabel('Total confirmed', color='green', alpha=0.5, size=20)
ax.set_xlabel('Country', color='green', alpha=0.5, size=20)


# In[10]:


html = df1.to_html()
text_file = open("index.html", "w")
text_file.write(html)
text_file.close()

