import cv2
import numpy as np
import os
from datetime import datetime

net = cv2.dnn.readNetFromCaffe('/Users/kirthika/Downloads/deploy.prototxt', '/Users/kirthika/Downloads/mobilenet_iter_73000.caffemodel')
cap = cv2.VideoCapture(0)

firebase_url = 'https://ml-transport-1-default-rtdb.firebaseio.com/'
firebase_secret = 'ItQZCGVw8HvBMKM03oVJKRfZAWAi6112wUHIwdXk'
vehicle_count_file = "vehicle_count_south.txt"

def update_vehicle_count(vehicle_count):
    with open(vehicle_count_file, 'w') as f:
        f.write(str(vehicle_count))

csv_filename = "VehicleCount.csv"
if csv_filename in os.listdir():
    os.remove(csv_filename)

with open(csv_filename, 'w') as f:
    f.write("Vehicle,Time\n")

def log_vehicle_count(count):
    with open(csv_filename, 'a') as f:
        now = datetime.now()
        dt_string = now.strftime('%H:%M:%S')
        f.write(f'Vehicle{count},{dt_string}\n')

while True:
    ret, img = cap.read()
    
    if not ret:
        break

    (h, w) = img.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(img, (300, 300)), 0.007843, (300, 300), 127.5)
    net.setInput(blob)
    detections = net.forward()

    vehicle_count = 0

    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        
        if confidence > 0.5:
            idx = int(detections[0, 0, i, 1])

            if idx == 7:
                vehicle_count += 1
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                
                cv2.rectangle(img, (startX, startY), (endX, endY), (0, 255, 0), 2)
                cv2.putText(img, "Car", (startX, startY - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)

    log_vehicle_count(vehicle_count)
    update_vehicle_count(vehicle_count)
    cv2.putText(img, f"Total Vehicles: {vehicle_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow('Vehicle Detection', img)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
