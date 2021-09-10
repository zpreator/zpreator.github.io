from bokeh.models import LogColorMapper
from bokeh.palettes import Oranges256 as oranges
from bokeh.sampledata.us_states import data as us_states
from bokeh.plotting import figure, show, output_file

import pandas as pd

starbucks = pd.read_csv("/Users/zacharypreator/datasets/starbucks.csv")
starbucks_us = starbucks[starbucks.Country == "US"]

starbucks_cnt_per_state = starbucks.groupby(by="State/Province").count()[["Store Number"]]\
                            .rename(columns={"Store Number":"Count"})
starbucks_avg_lat_lon = starbucks.groupby(by="State/Province").mean()[["Longitude", "Latitude"]]

starbucks_cnt_per_state = starbucks_cnt_per_state.join(starbucks_avg_lat_lon)
starbucks_cnt_per_state = starbucks_cnt_per_state.reset_index().rename(columns={"State/Province":"State"})

us_states_df = pd.DataFrame(us_states).T
us_states_df = us_states_df[~us_states_df["name"].isin(['Alaska', "Hawaii"])]
us_states_df["lons"] = us_states_df.lons.values.tolist()
us_states_df["lats"] = us_states_df.lats.values.tolist()
us_states_df = us_states_df.reset_index()
us_states_df = us_states_df.merge(starbucks_cnt_per_state[["State", "Count"]], how="left", left_on="index", right_on="State")

us_states_datasource = {}
us_states_datasource["lons"] = us_states_df.lons.values.tolist()
us_states_datasource["lats"] = us_states_df.lats.values.tolist()
us_states_datasource["name"] = us_states_df.name.values.tolist()
us_states_datasource["StateCodes"] = us_states_df.index.values.tolist()
us_states_datasource["StarbuckStores"] = us_states_df.Count.values.tolist()

fig = figure(plot_width=900, plot_height=600,
             title="United States Starbucks Store Count Per State Choropleth Map",
             x_axis_location=None, y_axis_location=None,
             tooltips=[
                        ("Name", "@name"), ("StarbuckStores", "@StarbuckStores"), ("(Long, Lat)", "($x, $y)")
                      ])

fig.grid.grid_line_color = None

fig.patches("lons", "lats", source=us_states_datasource,
            fill_color={'field': 'StarbuckStores', 'transform': LogColorMapper(palette=oranges[::-1])},
            fill_alpha=0.7, line_color="white", line_width=0.5)

output_file('index.html')

show(fig)