import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    'time_of_day': np.random.randint(0, 24, 1000),
    'day_of_week': np.random.randint(1, 8, 1000),
    'vehicle_count_north': np.random.randint(0, 100, 1000),
    'vehicle_count_south': np.random.randint(0, 100, 1000),
    'vehicle_count_east': np.random.randint(0, 100, 1000),
    'vehicle_count_west': np.random.randint(0, 100, 1000)
}

df = pd.DataFrame(data)

df['green_light_north'] = 30 + (df['vehicle_count_north'] / df['vehicle_count_north'].max()) * 60
df['green_light_south'] = 30 + (df['vehicle_count_south'] / df['vehicle_count_south'].max()) * 60
df['green_light_east'] = 30 + (df['vehicle_count_east'] / df['vehicle_count_east'].max()) * 60
df['green_light_west'] = 30 + (df['vehicle_count_west'] / df['vehicle_count_west'].max()) * 60

df['yellow_light_north'] = 5  # Fixed yellow light
df['yellow_light_south'] = 5
df['yellow_light_east'] = 5
df['yellow_light_west'] = 5

df['red_light_north'] = 120 - (df['green_light_north'] + df['yellow_light_north'] + df['green_light_south'] + df['green_light_east'] + df['green_light_west'])
df['red_light_south'] = 120 - (df['green_light_south'] + df['yellow_light_south'] + df['green_light_north'] + df['green_light_east'] + df['green_light_west'])
df['red_light_east'] = 120 - (df['green_light_east'] + df['yellow_light_east'] + df['green_light_north'] + df['green_light_south'] + df['green_light_west'])
df['red_light_west'] = 120 - (df['green_light_west'] + df['yellow_light_west'] + df['green_light_north'] + df['green_light_south'] + df['green_light_east'])

df.to_csv('traffic_signal_data_directions.csv', index=False)
print("Dataset saved to 'traffic_signal_data_directions.csv'")
